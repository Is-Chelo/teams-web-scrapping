FROM public.ecr.aws/lambda/nodejs:22

WORKDIR ${LAMBDA_TASK_ROOT}

# Copia dependencias y las instala
COPY package*.json ./
RUN npm install



COPY . .

CMD ["index.handler"]
