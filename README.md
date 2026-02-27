# Gestor_Opiniones_PMA
PMA del proyecto de gestor de opiniones que se realizó el día 20/02/2026

## Descripción del proyecto
El proyecto de descripcion de opiniones se trata de 2 servicios que son los siguientes:

1. Authentication Service: donde el usuario se registra, le manda un email de verificacion y activar cuenta, además el usuario puede editar su perfil (solamente email y username), hay otro endpoint para solicitar otro correo si se olvida la contraseña y cambiarla ademas de otro endpoint donde puede cambiar la contraseña pero solicitando el token de inicio de sesion además de la anterior contraseña. En este caso no se puede eliminar usuarios por seguridad.

2. GestorService: En este servicio es el corazón del proyecto, ya que se gestionan las publicaciones, solicitando el token de iniciar sesión para crear la publicación, donde se solicita descripción, categoria y el titulo de la publicación, además de poder editar el post pero solo el autor que lo subió, después eliminar.

El otro microservicio es de comentarios, donde otro usuario o puede ser el mismo creador/autor donde puede tomar el id de la publicación, y hacerle un comentario, además de poder editar y eliminar el mismo pero no puede eliminar el comentario de otras personas, para este servicio se "unieron" los endpoints de id de publicaciones más /comentarios.