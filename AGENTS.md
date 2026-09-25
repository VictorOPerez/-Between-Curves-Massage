# Contexto persistente del proyecto

- Este repositorio es Between Curves Massage. Para el consentimiento informado, consulta la sección "Protected consent form" y "Client preview" de `README.md` antes de cambiar el acceso, el formulario o el despliegue.
- La rama de vista previa es `preview/consent-redesign`. Su dominio público de Railway figura en `README.md`. La vista previa de Vercel requiere iniciar sesión y no sirve como enlace directo para clientas.
- El enlace `/consent/open?token=TOKEN` es reutilizable: cualquier persona con el enlace completo puede entrar. No está asociado a una clienta ni vence por sí mismo. La sesión que crea en el navegador dura ocho horas.
- Nunca guardes el token privado completo ni secretos de despliegue en el repositorio o en archivos de memoria. Si se necesita un enlace individual, con vencimiento o de un solo uso, hay que implementarlo; el sistema actual no ofrece esas garantías.
- Mantén esta nota y el `README.md` actualizados cuando cambie el comportamiento del consentimiento o su despliegue.
