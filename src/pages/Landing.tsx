import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code2, Users, Briefcase, MessageSquare, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Code2 className="h-4 w-4" />
              El marketplace tech más grande del Perú
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Conecta con el mejor{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                talento tech
              </span>{" "}
              peruano
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              DevConnect es la plataforma donde empresas encuentran freelancers talentosos
              y profesionales tech consiguen proyectos increíbles.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Empezar gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] opacity-20" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              ¿Por qué elegir DevConnect?
            </h2>
            <p className="text-lg text-muted-foreground">
              Todo lo que necesitas para conectar talento con oportunidades
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Perfiles Verificados</h3>
              <p className="text-muted-foreground">
                Freelancers y empresas verificados para garantizar calidad y confianza en cada conexión.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Briefcase className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Proyectos Diversos</h3>
              <p className="text-muted-foreground">
                Desde startups hasta empresas consolidadas, encuentra proyectos que se ajusten a tu perfil.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Chat en Tiempo Real</h3>
              <p className="text-muted-foreground">
                Comunícate instantáneamente con clientes o freelancers sin salir de la plataforma.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20 text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              ¿Listo para empezar?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Únete a cientos de profesionales y empresas que ya confían en DevConnect
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="shadow-lg">
                Crear cuenta gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">DevConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 DevConnect. Conectando talento tech peruano.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
