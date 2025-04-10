# pdb to gif

This Docker container will convert all pdbs in the pdbs folder to gif animation of a full protein rotation

### Prerequisites

- `docker`
docker Installation Guide](https://docs.docker.com/engine/install/)


### Usage
```
git clone git@github.com:victornemeth/pdb2gif.git && cd pdb2gif

docker build -t pdb2gif .

docker run --rm   -v "$PWD/pdbs:/data/pdbs"   -v "$PWD/output:/data/output"   pdb2gif
```

Takes arround 40 seconds per pdb
