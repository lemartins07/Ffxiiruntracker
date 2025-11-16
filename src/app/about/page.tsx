import { guideMeta } from '@/lib/guide-domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <Card className="bg-bg-surface">
        <CardHeader>
          <CardTitle className="font-heading text-3xl">Sobre o guia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-text-muted">
          <p>
            {guideMeta.title} {guideMeta.version && `— ${guideMeta.version}`} por {guideMeta.author}.
          </p>
          <p>
            Este projeto reorganiza o conteúdo em uma experiência interativa, com modo escuro, gamificação e integração
            de inventário.
          </p>
        </CardContent>
      </Card>

      {guideMeta.changelog && (
        <Card className="bg-bg-surface">
          <CardHeader>
            <CardTitle className="text-xl">Changelog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guideMeta.changelog.map((entry) => (
              <div key={entry.version}>
                <div className="text-sm font-semibold text-text-primary">
                  {entry.version} — {entry.date}
                </div>
                <ul className="ml-4 list-disc text-sm text-text-muted">
                  {entry.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
