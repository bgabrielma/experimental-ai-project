#!/bin/bash

set -e

ENV_FILE="$(pwd)/.env"

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
    echo "✅ Loaded environment from: $ENV_FILE"
else
    echo "❌ Error: .env file not found at: $ENV_FILE"
    exit 1
fi

# Verify MODEL_NAME is set
if [ -z "$MODEL_NAME" ]; then
    echo "Error: MODEL_NAME not set in .env file"
    exit 1
fi

echo "🔄 Pulling model: $MODEL_NAME"
docker model pull "$MODEL_NAME"

# Get model status
echo "📡 Checking model status:"
docker model status "$MODEL_NAME"

echo "✅ Model is available: $(docker model inspect "$MODEL_NAME")"