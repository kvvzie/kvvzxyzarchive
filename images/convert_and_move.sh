#!/bin/bash

# for every png / jpg
for img in *.png *.jpg; do
  # check does it exist
  [ -f "$img" ] || continue

  # filename without the .png/jpg
  filename="${img%.*}"

  # convert to webp quality set to 80
  cwebp -q 80 "$img" -o "${filename}.webp"

  # if succeded move to originalImages/
  if [ $? -eq 0 ]; then
    mv "$img" originalImages/
  else
    echo "Conversion of $img have not succeded, original file has not been moved."
  fi
done


