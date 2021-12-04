 #!/bin/bash
echo $1
echo $2
echo $3
Rscript main.R --args --dataset=$1 --metadata=$2 --task="$3"
