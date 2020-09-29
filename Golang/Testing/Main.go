package main

import (
	"fmt"
	"strconv"
)

func test(i int) string {
	return "Test " + strconv.Itoa(i)
}

func swap(a, b string) (string, string) {
	return b, a
}

func main() {
	var a string = "Test1"
	var b string = "Test2"

	fmt.Println(swap(a, b))

	for i := 0; i < 10; i++ {
		fmt.Println(test(i))
	}

	fmt.Println("While loop:")

	// While loop
	index := 0
	for ; index < 10; index++ {
		fmt.Println(test(index))
	}
}
