package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
)

func requestHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello world, Path = %s", r.URL.Path)
	log.Printf("server: Receive request from %s", r.URL.Path)
}

func main() {
	var HOST string = "0.0.0.0"
	var PORT int = 1337

	fmt.Println("~ Server Started ...")
	fmt.Printf("~ Listening on Port %d\n", PORT)

	http.HandleFunc("/test", requestHandler)
	http.ListenAndServe(HOST+":"+strconv.Itoa(PORT), nil)

}
