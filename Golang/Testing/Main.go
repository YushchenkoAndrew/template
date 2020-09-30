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

	var arr [10]int

	fmt.Println(swap(a, b))

	for i := 0; i < 10; i++ {
		arr[i] = i * i
		fmt.Println(test(i))
	}

	fmt.Println(arr)

	fmt.Println("While loop:")

	// While loop
	var index = 0
	for ; index < 10; index++ {
		fmt.Println(test(index))
	}

	// Range
	for k, v := range arr {
		fmt.Printf("key = %d, value = %d\n", k, v)
	}

	// Slice
	var s = arr[2:6]
	s = append(s, 52)

	fmt.Println(s)

}
