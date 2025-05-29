import { useEffect } from 'react';

export function Calendar() {
  useEffect(() => {
    // 페이지 진입 시 상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);

  const coffeeInfo = {
    title: "Addisu Hulichaye, Ethiopia",
    subtitle: "Addisu Hulichaye, Ethiopia",
    details: [
      { label: "varieties", value: "geisha" },
      { label: "process", value: "️natural" },
      { label: "region", value: "ugrara" },
      { label: "altitude", value: "1920-2030m" }
    ],
    description: `This natural processed lot of six Ethiopian varietals was produced by Addisu Hulichaye on his privately owned farm called Gololcha.

For many years, Ethiopian coffee has only been described as Ethiopian heirloom. This simplistic term does little to describe the diversity of the native coffee in Ethiopia as well as coffee varieties specifically developed by the Jimma Agricultural Research Centre. Addisu Hulichaye's farm is home to three native varieties, Welicho, Dega and Kudhumi, as well as three JARC varieties, 74110, 74112 and 74165, this lot is a combination of all six.

Addisu is a member of the Lalisaa Project, an initiative that aims to provide opportunity and resources for smallholder farmers in Sidamo.

Grown at 2092m above sea level, this coffee is delicately floral with a silky mouth feel and big tropical acidity. Brew with your favourite filter method.`
  };

  return (
    <div className="bg-white flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary leading-tight">
            {coffeeInfo.title}
          </h1>
          <p className="text-base font-light text-text-primary">
            {coffeeInfo.subtitle}
          </p>
        </div>

        {/* Coffee Details */}
        <div className="grid grid-cols-2 gap-4">
          {coffeeInfo.details.map((detail, index) => (
            <div key={index} className="space-y-1">
              <p className="text-base text-text-muted">
                {detail.label}
              </p>
              <p className="text-base font-semibold text-text-primary">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2.5 pb-6">
          <p className="text-base text-text-primary leading-relaxed whitespace-pre-line">
            {coffeeInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
} 