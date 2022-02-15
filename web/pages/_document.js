import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                    <script
                        type="text/javascript"
                        src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `var popup;
                window.addEventListener('load', function(){
                    window.cookieconsent.initialise({
                        "palette": {
                            "popup": {
                            "background": "white",
                            "text": "black"
                            },
                            "button": {
                            "background": "#0D9488",
                            }
                        },
                        "theme": "classic",
                        "type": "opt-in",
                        onStatusChange: function(status) {
                            // resquest gtag cookies on a new consent
                            if (this.hasConsented()) setCookies();
                            else deleteCookies(this.options.cookie.name)
                        },
                        onInitialise: function(status) {
                            if(status == cookieconsent.status.allow) setCookies();
                        },
                        law: {
                            regionalLaw: false,
                        },
                            location: true,
                        },function (p) {
                            popup = p;
                    });
                });

                function setCookies(){}
                
                function deleteCookies(cookieconsent_name) {
                        var keep = [cookieconsent_name, "DYNSRV"];
                        document.cookie.split(';').forEach(function(c) {
                            c = c.split('=')[0].trim();
                            if (!~keep.indexOf(c))
                                document.cookie = c + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
                        });
                };`
                        }}
                    />

                </body>
            </Html>
        );
    }
}

export default MyDocument;