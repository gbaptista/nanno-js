from http.server import HTTPServer, SimpleHTTPRequestHandler

class RequestHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = SimpleHTTPRequestHandler.translate_path(self, path)
        path = path.replace('/nanno-js', '/nanno-js/docs')
        path = path.replace('docs/nanno-js/docs/', 'docs/')
        return path

if __name__ == '__main__':
    HTTPServer(('0.0.0.0', 8000), RequestHandler).serve_forever()
