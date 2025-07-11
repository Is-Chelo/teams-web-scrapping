FROM public.ecr.aws/lambda/nodejs:22

WORKDIR ${LAMBDA_TASK_ROOT}

# Copia dependencias y las instala
COPY package*.json ./
RUN npm install

# Instala las librerías necesarias para ejecutar Chromium
RUN dnf install -y \
    atk \
    cups-libs \
    gtk3 \
    libX11 \
    libXcomposite \
    libXcursor \
    libXdamage \
    libXext \
    libXi \
    libXrandr \
    libXrender \
    libXtst \
    pango \
    libdrm \
    mesa-libGL \
    libgbm \
    libxshmfence \
    nspr \
    nss \
    alsa-lib \
    xorg-x11-fonts-Type1 \
    xorg-x11-fonts-misc \
    && dnf clean all && rm -rf /var/cache/dnf

COPY . .

CMD ["index.handler"]
