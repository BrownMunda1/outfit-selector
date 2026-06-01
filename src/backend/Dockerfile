FROM python:3.12

# Set working directory
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# First is the project source, second is the docker working directory. so basically its like copy 1 into 2
COPY . .

# Expose port
EXPOSE 8000

# Run app
CMD ["python", "-m", "main"]
