import common as c
from config import ssl_dir, os_name
import sys
import os

c.print('>> Checking SSL for Qt for {}'.format(os_name))

dest_dir = os.path.join(ssl_dir, 'bin')
os.makedirs(dest_dir, exist_ok=True)

if os_name == 'linux' or os_name == 'macos':
    c.print('>> {} build: relying on host system SSL'.format(os_name))
    sys.exit(0)

# Windows OpenSSL mirrors
urls = []
if os_name == 'win64':
    urls = [
        'https://github.com/IndySockets/OpenSSL-Binaries/raw/master/openssl-1.1.1w-win64.zip',
        'https://wiki.overbyte.eu/arch/openssl-1.1.1w-win64.zip',
    ]
elif os_name == 'win32':
    urls = [
        'https://github.com/IndySockets/OpenSSL-Binaries/raw/master/openssl-1.1.1w-win32.zip',
        'https://wiki.overbyte.eu/arch/openssl-1.1.1w-win32.zip',
    ]

downloaded = False
for url in urls:
    file_name = os.path.basename(url)
    try:
        c.print('>> Downloading SSL from {}'.format(url))
        c.download(url, file_name)
        c.extract(file_name, dest_dir)
        downloaded = True
        c.print('>> SSL binaries successfully extracted to {}'.format(dest_dir))
        break
    except Exception as e:
        c.print('>> Warning: failed to download from {}: {}'.format(url, e))

if not downloaded:
    c.print('>> Notice: OpenSSL download skipped; Qt 6 on Windows uses native Windows Schannel TLS by default.')
