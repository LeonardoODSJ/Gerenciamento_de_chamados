#!/bin/bash
set -e

# Instala o Azure Dev CLI via script
curl -fsSL https://aka.ms/install-azd.sh | bash

cd app
# xdg-open http://127.0.0.1:5000

# Realiza o login com as credenciais fornecidas
azd login --tenant-id "6d6bcc3f-bda1-4f54-af1d-86d4b7d4e6b8" --client-id "f94768f4-42c4-4fd9-8e62-6699880ba685" --client-secret "Dib8Q~u~zuxqbmHurcfEEZ-zNsTc~nbqL4fGRcwW"

# Inicia a aplicação
npm start
if [ $? -ne 0 ]; then
    echo "Failed to start backend"
    exit $?
fi
