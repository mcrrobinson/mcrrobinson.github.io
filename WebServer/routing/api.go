package routing

import (
	"context"
	"crypto/tls"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// CreateWebServer creates the mux instance and sets the endpoints.
func (route *Router) CreateWebServer() {
	r := mux.NewRouter()
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))
	r.HandleFunc("/", route.HomePage).Methods("GET")
	r.HandleFunc("/about", route.AboutPage).Methods("GET")
	r.HandleFunc("/project", route.ProjectsPage).Methods("GET")
	r.HandleFunc("/social", route.SocialPage).Methods("GET")

	route.apiServer = &http.Server{
		Addr:    fmt.Sprintf(":%d", route.webPort),
		Handler: handlers.CORS()(r),
		TLSConfig: &tls.Config{
			Certificates: []tls.Certificate{route.cert},
		},
	}
}

func (route *Router) Middleware()  {
	route.logger.Info("Middleware")
	go http.ListenAndServe(":80", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		route.logger.Info("Redirecting to HTTPS")
		http.Redirect(w, r, "https://"+route.webIP, http.StatusMovedPermanently)
	}))
}

// ListenWebServer starts the API server on a new thread as ListenAndServe blocks.
func (route *Router) ListenWebServer(stop chan bool) {
	route.logger.Info(
		"Starting Web Server",
		"address", route.apiServer.Addr,
	)

	go func() {

		// Shouldn't need to justify the certificate and key again but it has
		// problems. Look into this later.
		err := route.apiServer.ListenAndServeTLS(route.certFile, route.keyFile)
		if err != nil {
			route.logger.Crit(err.Error())
			stop <- true
		}
	}()
}

// WebShutdown stops the API.
func (route *Router) WebShutdown() error {
	route.logger.Info("Web Server Shutting down")

	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)
	defer cancel()

	return route.apiServer.Shutdown(ctx)
}
