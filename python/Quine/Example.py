# Some simple Example of Quines
c='c=%r;print(c%%c)';print(c%c)

# Another one
b='b={}{}{};print(b.format(chr(39),b,chr(39)))';print(b.format(chr(39),b,chr(39)))
