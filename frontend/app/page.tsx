import MementoMori from '@/components/memento-mori'

export default function Home() {
  // Set a default birth date - you can modify this or make it configurable
  const birthDate = new Date('1990-01-01')

  return (
    <div className="min-h-screen bg-background">
      <MementoMori birthDate={birthDate} />
    </div>
  )
}
