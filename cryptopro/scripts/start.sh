#!/bin/bash
# Скрипт выполняется однократно при запуске контейнера
source lib/colors.sh
source lib/functions.sh

info "Configuring cryptopro"

CERTIFICATE_PIN=$([ -n "$CERTIFICATE_PIN" ] && echo "$CERTIFICATE_PIN" || echo "")
ESIA_ENVIRONMENT=$([ -n "$ESIA_ENVIRONMENT" ] && echo "$ESIA_ENVIRONMENT" || echo "test")
export CERTIFICATE_PIN="$CERTIFICATE_PIN"
export ESIA_ENVIRONMENT="$ESIA_ENVIRONMENT"

/cryptopro/scripts/setup_license $LICENSE
/cryptopro/scripts/setup_root "/cryptopro/esia/esia_${ESIA_ENVIRONMENT}.cer"
/cryptopro/scripts/setup_my_certificate /cryptopro/certificates/certificate_bundle.zip ${CERTIFICATE_PIN}

info "Configuration finished, starting service..."
exec npm start