#!/bin/bash

echo "Updating package list..."
sudo apt-get update

# Check if python3 is installed
if ! command -v python3 &> /dev/null
then
    echo "python3 could not be found, installing..."
    sudo apt-get update && sudo apt-get install -y python3 python3-pip
else
    echo "python3 is already installed"
fi

# Check if python is installed as well
if ! command -v python &> /dev/null
then
    echo "python could not be found, creating symlink to python3..."
    sudo ln -s /usr/bin/python3 /usr/bin/python
else
    echo "python is already installed"
fi

# Install g++ if not installed
if ! command -v g++ &> /dev/null
then
    echo "g++ could not be found, installing..."
    sudo apt-get update && sudo apt-get install -y g++
else
    echo "g++ is already installed"
fi

# Check if Java is installed
if ! command -v java &> /dev/null
then
    echo "Java could not be found, installing..."

    # Install OpenJDK (Java Development Kit)
    sudo apt-get install -y openjdk-11-jdk

    # Verify installation
    echo "Java version:"
    java -version
else
    echo "Java is already installed"
    java -version
fi

# Install dependencies
npm install
