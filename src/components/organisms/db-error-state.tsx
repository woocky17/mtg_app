interface DbErrorStateProps {
  error: unknown;
}

const CONNECTION_ERROR_MARKERS = [
  "Can't reach database server",
  "ECONNREFUSED",
  "P1001",
  "P1002",
];

function isConnectionError(message: string): boolean {
  return CONNECTION_ERROR_MARKERS.some((m) => message.includes(m));
}

export function DbErrorState({ error }: DbErrorStateProps) {
  const message = error instanceof Error ? error.message : String(error);
  const connection = isConnectionError(message);

  const title = connection
    ? "No hay conexión con la base de datos"
    : "Algo ha ido mal";
  const description = connection
    ? "Comprueba que el contenedor de PostgreSQL está levantado."
    : "No se han podido cargar los datos.";

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div
        className="max-w-lg rounded-lg border p-8 text-center"
        style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}
      >
        <div className="mb-4 text-5xl">🔌</div>
        <h2
          className="mb-2 text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
        {connection && (
          <pre
            className="rounded px-3 py-2 text-left text-sm"
            style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
          >
            docker compose -f docker/docker-compose.yml up -d
          </pre>
        )}
      </div>
    </div>
  );
}
