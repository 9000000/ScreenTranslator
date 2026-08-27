from os import getenv, path
import re

app_name = 'ScreenTranslator'

target_name = app_name
qt_version = '5.15.2'
qt_modules = ['qtbase', 'qttools', 'icu',
              'qttranslations', 'qtx11extras', 'qtwebengine', 'qtwebchannel',
              'qtdeclarative', 'qtlocation', 'opengl32sw', 'd3dcompiler_47',
              'qtserialport']
qt_dir = path.abspath('qt')
ssl_dir = path.abspath('ssl')

build_dir = path.abspath('build')
dependencies_dir = path.abspath('deps')
pro_file = path.abspath(path.dirname(__file__) +
                        '/../../screen-translator.pro')
test_pro_file = path.abspath(path.dirname(__file__) +
                             '/../../tests/tests.pro')
bin_name = 'screen-translator'

custom_version = getenv('VERSION') or getenv('APP_VERSION')
if custom_version:
    app_version = custom_version.lstrip('v').strip()
else:
    app_version = '3.3.0'
    if path.exists(pro_file):
        with open(pro_file, 'r') as f:
            match = re.search(r'VER\s*=\s*(.*)', f.read())
            if match:
                app_version = match.group(1).strip()

ts_files_dir = path.abspath(path.dirname(__file__) + '/../../translations')

os_name = getenv('OS', 'linux')
app_version += {'linux': '', 'macos': '-experimental',
                'win32': '', 'win64': ''}.get(os_name, '')
bitness = '32' if os_name == 'win32' else '64'
msvc_version = getenv('MSVC_VERSION', '')

build_type = 'release' # 'debug'
