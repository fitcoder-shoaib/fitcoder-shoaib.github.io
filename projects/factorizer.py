import argparse
parser = argparse.ArgumentParser(description="PROGRAM TO FIND THE FACTORS OF A NUMBER")
parser.add_argument("Number", type=int, help="Number who's factors are going to be displayed as the output of the program")
args = parser.parse_args()


print("\nPROGRAM TO FIND THE FACTORS OF A NUMBER \nFor more help please use -h after the program name\n\n")

factors = []

for numbers in range(1, args.Number):
    if args.Number % numbers == 0:
        factors.append(numbers)
    else:
        pass

factors.append(args.Number)
print(f"The numbers divisible by {args.Number} are = {factors}\n")

if len(factors) > 2:
    print("Not a prime number\n\n")

else:
    print("Prime number\n\n")

