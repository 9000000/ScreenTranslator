import common as c
from config import qt_version, qt_dir, os_name
import os
import sys
import subprocess

c.print('>> Setting up Qt {} for {}'.format(qt_version, os_name))

# Ensure aqtinstall is available
try:
    import aqt
except ImportError:
    c.print('>> Installing aqtinstall via pip...')
    subprocess.run([sys.executable, '-m', 'pip', 'install', 'aqtinstall'], check=True)

if os_name == 'linux':
    host = 'linux'
    arch = 'gcc_64'
    qt_dir_prefix = os.path.abspath('{}/gcc_64'.format(qt_version))
elif os_name == 'win64' or os_name == 'win32':
    host = 'windows'
    arch = 'win64_msvc2019_64'
    qt_dir_prefix = os.path.abspath('{}/msvc2019_64'.format(qt_version))
elif os_name == 'macos':
    host = 'mac'
    arch = 'clang_64'
    qt_dir_prefix = os.path.abspath('{}/clang_64'.format(qt_version))
else:
    host = 'linux'
    arch = 'gcc_64'
    qt_dir_prefix = os.path.abspath('{}/gcc_64'.format(qt_version))

# Run aqtinstall
modules = ['qtwebengine', 'qt5compat', 'qtwebchannel', 'qtpositioning', 'qtserialport']
cmd = [sys.executable, '-m', 'aqt', 'install-qt', host, 'desktop', qt_version, arch, '-m'] + modules
c.print('>> Running: {}'.format(' '.join(cmd)))
subprocess.run(cmd, check=True)

if os.path.exists(qt_dir_prefix):
    c.symlink(qt_dir_prefix, qt_dir)

c.print('>> Qt {} successfully installed to {}'.format(qt_version, qt_dir))
