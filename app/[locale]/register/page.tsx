'use client';
import { useLocale } from 'next-intl';

export default function RegisterPage() {
  const locale = useLocale();

  const heading =
    locale === 'ka' ? 'კანდიდატის რეგისტრაცია' :
    locale === 'ru' ? 'Регистрация кандидата' :
    'Candidate Registration';

  const subtitle =
    locale === 'ka' ? 'შეავსეთ ოფიციალური სარეგისტრაციო ფორმა ქვემოთ.' :
    locale === 'ru' ? 'Заполните официальную регистрационную форму ниже.' :
    'Fill out the official registration form below.';

  const notice =
    locale === 'ka' ? 'განაცხადი ივსება ოფიციალურ სარეგისტრაციო ფორმაში.' :
    locale === 'ru' ? 'Заявка заполняется в официальной регистрационной форме.' :
    'The application is filled out in the official registration form.';

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0f2557] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-14 h-1 bg-yellow-500 rounded-full mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{heading}</h1>
          <p className="text-blue-200 text-xl mb-4">{subtitle}</p>
          <p className="inline-flex items-center gap-2 text-yellow-400 text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
            {notice}
          </p>
        </div>
      </section>

      {/* Tally form embed */}
      <section className="bg-slate-50 py-12" style={{ minHeight: '900px' }}>
        <div className="max-w-3xl mx-auto px-4">
          <iframe
            src="https://tally.so/embed/dWzRXd?alignLeft=1&hideTitle=1&transparentBackground=1"
            width="100%"
            height="1100"
            style={{ border: 'none', borderRadius: '16px', display: 'block' }}
            title="WVG Registration Form"
            loading="lazy"
            allow="camera; microphone"
          />
        </div>
      </section>
    </div>
  );
}
