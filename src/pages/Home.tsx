import { Badge } from '../components/ui/Badge';
import { M1CTLogo, ArrowRightIcon } from '../components/icons';

export function Home() {
  const badges = [
    { id: '1', label: 'lemon peel' },
    { id: '2', label: 'peach' },
    { id: '3', label: 'orange' },
    { id: '4', label: 'butter milk pudding' },
  ];

  return (
    <div className="flex flex-col gap-1 min-h-screen">
      {/* Title Section */}
      <section className="bg-white rounded-b-2xl px-6 py-12 flex flex-col gap-2 flex-1">
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-text-primary leading-tight tracking-tight">
            Addisu Hulichaye, Ethiopia
          </h1>
          <p className="text-base font-light text-text-primary mt-2 tracking-tight">
            Addisu Hulichaye, Ethiopia
          </p>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {badges.map((badge, index) => (
            <Badge key={index}>
              {badge.label}
            </Badge>
          ))}
        </div>
      </section>

      {/* Comment Card */}
      <section className="bg-comment-bg rounded-2xl p-6">
        <div className="flex flex-col gap-2.5">
          <p className="text-sm text-text-muted font-normal mb-2">
            master comment
          </p>
          <p className="text-base font-bold text-text-primary">
            "Addisu is a member of the Lalisaa Project, an initiative that aims to provide opportunity and resources for smallholder farmers in Sidamo."
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cta-bg rounded-2xl p-6">
        <div className="flex justify-between items-center gap-2">
          {/* Logo */}
          <M1CTLogo className="text-text-primary" />
          
          {/* Buy Button */}
          <div className="flex items-center gap-2 px-4 py-2 border border-dark-navy rounded-full">
            <span className="text-base font-bold text-text-primary">
              buy whole bean
            </span>
            <ArrowRightIcon size={24} />
          </div>
        </div>
      </section>
    </div>
  );
} 