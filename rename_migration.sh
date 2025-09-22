#!/bin/bash

# Obter a data atual no formato YYYYMMDD
CURRENT_DATE=$(date +%Y%m%d)

# Diretório das migrações
MIGRATION_DIR="/Users/leonardomendonca/Ferro facil/ferro-facil/supabase/migrations"

# Arquivo de migração original
ORIGINAL_FILE="${MIGRATION_DIR}/20250905000000_add_below_banner_images.sql"

# Novo nome de arquivo com data atual
NEW_FILE="${MIGRATION_DIR}/${CURRENT_DATE}000000_add_below_banner_images.sql"

# Verificar se o arquivo original existe
if [ -f "$ORIGINAL_FILE" ]; then
    # Renomear o arquivo
    mv "$ORIGINAL_FILE" "$NEW_FILE"
    echo "Arquivo de migração renomeado para: $(basename "$NEW_FILE")"
else
    echo "Arquivo de migração original não encontrado: $(basename "$ORIGINAL_FILE")"
fi