package main

import (
	"fmt"
	"log"
	"net/http"
)

func IndexHanlder(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello")
}

func main() {
	fmt.Println("Ws server")

	http.HandleFunc("/", IndexHanlder)
	log.Fatal(http.ListenAndServe(":8080", nil))
}