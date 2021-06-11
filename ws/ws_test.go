package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/websocket"
)

func TestWsHandler(t *testing.T) {
	s := httptest.NewServer(http.HandlerFunc(wsHandler))

	defer s.Close()

	url := "ws" + strings.TrimPrefix(s.URL, "http")

	ws, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		t.Fatal(err)
	}

	defer ws.Close()

	err = ws.WriteMessage(websocket.TextMessage, []byte("hello from test"))
	if err != nil {
		t.Fatal(err)
	}

	_, p, err := ws.ReadMessage()

	if err != nil {
		t.Fatal(err)
	}

	exp := "Pong! | hello from test"
	if string(p) != exp {
		t.Fatalf("bad message, exp: %s, got: %s", exp, string(p))
	}
}