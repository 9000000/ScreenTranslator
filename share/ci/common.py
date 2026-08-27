import os
import subprocess as sub
import urllib.request
from shutil import which
import zipfile
import tarfile
import functools
import shutil
import multiprocessing
import platform
import re
import ast
import hashlib


print = functools.partial(print, flush=True)


def run(cmd, capture_output=False, silent=False):
    print('>> Running', cmd)
    if capture_output:
        result = sub.run(cmd, check=True, shell=True, universal_newlines=True,
                         stdout=sub.PIPE, stderr=sub.STDOUT)
        if not silent:
            print(result.stdout)
    else:
        if not silent:
            result = sub.run(cmd, check=True, shell=True)
        else:
            result = sub.run(cmd, check=True, shell=True,
                             stdout=sub.DEVNULL, stderr=sub.DEVNULL)
    return result


def download(url, out, force=False):
    print('>> Downloading', url, 'as', out)
    if not force and os.path.exists(out):
        print('>>', out, 'already exists')
        return
    out_path = os.path.dirname(out)
    if len(out_path) > 0:
        os.makedirs(out_path, exist_ok=True)
    urllib.request.urlretrieve(url, out)


def extract(src, dest):
    abs_path = os.path.abspath(src)
    print('>> Extracting', abs_path, 'to', dest)
    if len(dest) > 0:
        os.makedirs(dest, exist_ok=True)

    if which('cmake'):
        out = run('cmake -E tar t "{}"'.format(abs_path),
                  capture_output=True, silent=True)
        files = out.stdout.split('\n')
        already_exist = True
        for file in files:
            if not os.path.exists(os.path.join(dest, file)):
                already_exist = False
                break
        if already_exist:
            print('>> All files already exist')
            return
        sub.run('cmake -E tar xvf "{}"'.format(abs_path),
                check=True, shell=True, cwd=dest)
        return

    is_tar_smth = src.endswith('.tar', 0, src.rfind('.'))
    if which('7z'):
        sub.run('7z x "{}" -o"{}"'.format(abs_path, dest),
                check=True, shell=True, input=b'S\n')

        if is_tar_smth:
            inner_name = abs_path[:abs_path.rfind('.')]
            sub.run('7z x "{}" -o"{}"'.format(inner_name, dest),
                    check=True, shell=True, input=b'S\n')
        return

    if src.endswith('.tar') or is_tar_smth:
        path = abs_path if platform.system() != "Windows" else os.path.relpath(abs_path)
        if which('tar'):
            sub.run('tar xf "{}" --keep-newer-files -C "{}"'.format(path, dest),
                    check=True, shell=True)
            return

    raise RuntimeError('No archiver to extract {} file'.format(src))


def get_folder_files(path):
    result = []
    for root, _, files in os.walk(path):
        for file in files:
            result.append(os.path.join(root, file))
    return result


def get_archive_top_dir(path):
    """Return first top level folder name in given archive or raises RuntimeError"""
    with tarfile.open(path) as tar:
        first = tar.next()
        if not first is None:
            result = os.path.dirname(first.path)
            if len(result) == 0:
                result = first.path
            return result
    raise RuntimeError('Failed to open file or empty archive ' + path)


def archive(files, out):
    print('>> Archiving', files, 'into', out)
    if out.endswith('.zip'):
        arc = zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED)
        for f in files:
            arc.write(f)
        arc.close()
        return

    if out.endswith('.tar.gz'):
        arc = tarfile.open(out, 'w|gz')
        for f in files:
            arc.add(f)
        arc.close()
        return

    raise RuntimeError('No archiver to create {} file'.format(out))


def symlink(src, dest):
    print('>> Creating symlink', src, '=>', dest)
    norm_src = os.path.normcase(src)
    norm_dest = os.path.normcase(dest)
    if os.path.lexists(norm_dest):
        if os.path.isdir(norm_dest) and not os.path.islink(norm_dest):
            try:
                os.rmdir(norm_dest)
            except OSError:
                shutil.rmtree(norm_dest, ignore_errors=True)
        else:
            try:
                os.remove(norm_dest)
            except OSError:
                shutil.rmtree(norm_dest, ignore_errors=True)
    try:
        os.symlink(norm_src, norm_dest,
                   target_is_directory=os.path.isdir(norm_src))
    except OSError as e:
        if platform.system() == "Windows":
            if os.path.isdir(norm_src):
                sub.run('cmd /c mklink /j "{}" "{}"'.format(norm_dest, norm_src), check=True, shell=True)
            else:
                sub.run('cmd /c mklink /h "{}" "{}"'.format(norm_dest, norm_src), check=True, shell=True)
        else:
            raise e


def recreate_dir(path):
    shutil.rmtree(path, ignore_errors=True)
    os.mkdir(path)


def ensure_clean_windows_path():
    if platform.system() != "Windows":
        return
    paths = os.environ.get('PATH', '').split(';')
    cleaned_paths = [p for p in paths if p and not (
        p.lower().endswith(r'\git\usr\bin') or 
        p.lower().endswith(r'/git/usr/bin') or 
        p.lower().endswith(r'\usr\bin') or 
        p.lower().endswith(r'/usr/bin')
    )]
    cl_path = which('cl.exe') or which('cl')
    if cl_path:
        msvc_bin = os.path.dirname(os.path.abspath(cl_path))
        if msvc_bin not in cleaned_paths:
            cleaned_paths.insert(0, msvc_bin)
    os.environ['PATH'] = ';'.join(cleaned_paths)


ensure_clean_windows_path()


def add_to_path(entry, prepend=True):
    path_separator = ';' if platform.system() == "Windows" else ':'
    if prepend:
        os.environ['PATH'] = entry + path_separator + os.environ['PATH']
    else:
        os.environ['PATH'] = os.environ['PATH'] + path_separator + entry
    ensure_clean_windows_path()


def get_msvc_env_cmd(bitness='64', msvc_version=''):
    """Return environment setup command for running msvc compiler for current platform"""
    if platform.system() != "Windows":
        return None

    ensure_clean_windows_path()
    if which('cl.exe') or which('cl'):
        print('>> cl.exe is already in PATH, skipping environment setup')
        return None

    possible_paths = [
        msvc_version,
        r'C:\Program Files\Microsoft Visual Studio\2022\Enterprise',
        r'C:\Program Files\Microsoft Visual Studio\2022\Community',
        r'C:\Program Files\Microsoft Visual Studio\2022\Professional',
        r'C:\Program Files\Microsoft Visual Studio\2022\BuildTools',
        r'C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise',
        r'C:\Program Files (x86)\Microsoft Visual Studio\2019\Community',
        r'C:\Program Files (x86)\Microsoft Visual Studio\2019\Professional',
        r'C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools',
    ]

    for p in possible_paths:
        if not p or not os.path.exists(p):
            continue
        vcvars = os.path.normpath(os.path.join(p, 'VC', 'Auxiliary', 'Build', f'vcvars{bitness}.bat'))
        if os.path.exists(vcvars):
            print('>> Found MSVC environment script at:', vcvars)
            return f'"{vcvars}"'
        vcvarsall = os.path.normpath(os.path.join(p, 'VC', 'Auxiliary', 'Build', 'vcvarsall.bat'))
        if os.path.exists(vcvarsall):
            arch = 'x64' if bitness == '64' else 'x86'
            print('>> Found MSVC vcvarsall script at:', vcvarsall)
            return f'"{vcvarsall}" {arch}'

    print('>> Warning: No Visual Studio environment script found.')
    return None


def get_cmake_arch_args(bitness='64'):
    if platform.system() != "Windows":
        return ''
    return '-A {}'.format('Win32' if bitness == '32' else 'x64')


def get_make_cmd():
    """Return `make` command for current platform"""
    return 'nmake' if platform.system() == "Windows" else 'make'


def set_make_threaded():
    """Adjust environment to run threaded make command"""
    if platform.system() == "Windows":
        os.environ['CL'] = '/MP'
    else:
        os.environ['MAKEFLAGS'] = '-j{}'.format(multiprocessing.cpu_count())


def is_inside_docker():
    """ Return True if running in a Docker container """
    with open('/proc/1/cgroup', 'rt') as f:
        return 'docker' in f.read()


def ensure_got_path(path):
    os.makedirs(path, exist_ok=True)


def apply_cmd_env(cmd):
    """Run cmd and apply its modified environment"""
    if not cmd:
        return
    print('>> Applying env after', cmd)
    separator = 'env follows'
    script = "import os,sys;sys.stdout.buffer.write(str(dict(os.environ)).encode('utf-8'))"
    if platform.system() == "Windows":
        cmd_line = f'cmd.exe /s /c "{cmd} && echo {separator} && python -c \"{script}\""'
        env = sub.run(cmd_line, shell=False, stdout=sub.PIPE, stderr=sub.PIPE, encoding='utf-8')
    else:
        env = sub.run('{} && echo "{}" && python -c "{}"'.format(cmd, separator, script),
                      shell=True, stdout=sub.PIPE, stderr=sub.PIPE, encoding='utf-8')

    try:
        idx = env.stdout.index(separator)
        stringed = env.stdout[idx + len(separator) + 1:]
        parsed = ast.literal_eval(stringed)
    except ValueError as e:
        print("ERROR: Failed to apply environment after command:", cmd)
        print("STDOUT:", env.stdout)
        print("STDERR:", env.stderr)
        raise e

    for key, value in parsed.items():
        if key in os.environ and os.environ[key] == value:
            continue
        if key in os.environ:
            print('>>> Changing env', key, '\nfrom\n',
                  os.environ[key], '\nto\n', value)
        os.environ[key] = value


def md5sum(path):
    if not os.path.exists(path):
        return ''
    md5 = hashlib.md5()
    with open(path, 'rb') as f:
        md5.update(f.read())
        return md5.hexdigest()
    return ''
