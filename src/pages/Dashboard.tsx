import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Project, Contract } from "@/types";
import { Plus, Briefcase, FileText, Calendar } from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, contractsData] = await Promise.all([
          api.getProjects(),
          api.getContracts(),
        ]);
        setProjects(projectsData.slice(0, 6));
        setContracts(contractsData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Explora proyectos y contratos disponibles</p>
          </div>
          <div className="flex gap-2">
            <Link to="/projects/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </Link>
            <Link to="/contracts/new">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Contrato
              </Button>
            </Link>
          </div>
        </div>

        {/* Projects Section */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <Briefcase className="h-5 w-5 text-primary" />
              Proyectos Recientes
            </h2>
            <Link to="/projects">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Card key={project._id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(project.createdAt).toLocaleDateString("es-PE")}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 font-medium">No hay proyectos aún</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Sé el primero en publicar un proyecto
                  </p>
                  <Link to="/projects/new">
                    <Button>Crear Proyecto</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Contracts Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <FileText className="h-5 w-5 text-accent" />
              Contratos Recientes
            </h2>
            <Link to="/contracts">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <Card key={contract._id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <CardTitle className="line-clamp-1">{contract.title}</CardTitle>
                      <Badge
                        variant={
                          contract.status === "published"
                            ? "default"
                            : contract.status === "in_progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {contract.status === "published" && "Publicado"}
                        {contract.status === "in_progress" && "En progreso"}
                        {contract.status === "completed" && "Completado"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{contract.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(contract.createdAt).toLocaleDateString("es-PE")}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 font-medium">No hay contratos aún</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Sé el primero en publicar un contrato
                  </p>
                  <Link to="/contracts/new">
                    <Button>Crear Contrato</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
