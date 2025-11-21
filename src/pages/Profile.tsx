import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Save } from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    university: user?.university || "",
    skills: user?.skills?.join(", ") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUser({
        name: formData.name,
        bio: formData.bio,
        university: formData.university,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
            <CardDescription>Administra tu información personal y profesional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImageUrl} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Cambiar foto
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    JPG, PNG o GIF. Máx 5MB
                  </p>
                </div>
              </div>

              {/* Role Badge */}
              <div>
                <Label>Tipo de cuenta</Label>
                <div className="mt-2">
                  <Badge variant="secondary" className="capitalize">
                    {user.role === "freelancer" ? "Freelancer" : "Empresa"}
                  </Badge>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing || isLoading}
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    placeholder="Cuéntanos sobre ti..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing || isLoading}
                  />
                </div>

                {/* University */}
                <div className="space-y-2">
                  <Label htmlFor="university">Universidad</Label>
                  <Input
                    id="university"
                    placeholder="Ej: Universidad Nacional de Ingeniería"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    disabled={!isEditing || isLoading}
                  />
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label htmlFor="skills">Habilidades</Label>
                  <Input
                    id="skills"
                    placeholder="React, Node.js, Python, etc. (separadas por comas)"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    disabled={!isEditing || isLoading}
                  />
                  {user.skills && user.skills.length > 0 && !isEditing && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button type="submit" disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name,
                            bio: user.bio || "",
                            university: user.university || "",
                            skills: user.skills?.join(", ") || "",
                          });
                        }}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Editar perfil
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
