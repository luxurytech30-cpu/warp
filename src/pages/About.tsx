import { Card } from '@/components/ui/card';
import { Award, Users, Truck, Shield, Target, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            عن <span className="text-gradient-primary">Perfect Wrap</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            علامة أنثوية متخصصة في الهدايا المخصصة، تجمع بين الطباعة الفاخرة والتغليف الراقي لتصنعي لحظات لا تُنسى.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">8+</div>
            <div className="text-muted-foreground">سنوات من الإبداع</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">40K+</div>
            <div className="text-muted-foreground">هدية شخصية وصلت لأحبابكم</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">500+</div>
            <div className="text-muted-foreground">تصميمات وأنماط جاهزة للتخصيص</div>
          </Card>
          <Card className="p-8 text-center shadow-card hover:shadow-premium transition-shadow">
            <div className="text-4xl font-black text-primary mb-2">99%</div>
            <div className="text-muted-foreground">رضا العملاء وشغفهم</div>
          </Card>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <Card className="p-12 shadow-premium gradient-hero text-white">
            <h2 className="text-3xl font-black mb-6">حكايتنا</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                بدأنا بفكرة بسيطة: هدية شخصية تحمل الاسم أو العبارة التي تعني لكِ الكثير. من استوديو صغير، صنعنا
                أولى الأكواب المطبوعة بألوان زاهية وشرايط حريرية ناعمة.
              </p>
              <p>
                اليوم، Perfect Wrap تضم فريق تصميم، طباعة، وتغليف يعمل بتناغم، ليصلك كل منتج بلمسة أنثوية فاخرة
                وبجودة تُحاكي الهدايا الراقية.
              </p>
              <p>
                نختار خاماتنا بعناية، من السيراميك المخملي إلى الأقمشة الناعمة، ونطبع بأحبار صديقة للبيئة، لنقدم لكِ
                هدية تدوم وتبهر.
              </p>
            </div>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-12">
            قيمنا <span className="text-gradient-gold">الأنثوية الراقية</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">جودة محسوسة</h3>
              <p className="text-muted-foreground leading-relaxed">
                كل قطعة تمر باختبارات جودة دقيقة، لنضمن ملمسًا ناعمًا، طباعة حادة، وتغليفًا يحفظ اللمعة.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">خدمة شخصية</h3>
              <p className="text-muted-foreground leading-relaxed">
                نهتم بتفاصيلك: من اختيار الخط المناسب لاسمك، حتى اقتراح ألوان التغليف التي تعبر عن المناسبة.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">سرعة بتأنق</h3>
              <p className="text-muted-foreground leading-relaxed">
                نجهز طلبك بسرعة دون أن نفقد التفاصيل الدقيقة أو اللمسة اللامعة على كل عبوة.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">موثوقية</h3>
              <p className="text-muted-foreground leading-relaxed">
                نفي بالوعد: تصميمك كما تخيلته، شحنك في موعده، وتغليف يحافظ على فخامة الهدية.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">إتقان حرفي</h3>
              <p className="text-muted-foreground leading-relaxed">
                فريق التصميم والطباعة لدينا مدرَّب على أدق التفاصيل لتخرج القطعة متوازنة وأنيقة.
              </p>
            </Card>

            <Card className="p-8 shadow-card hover:shadow-premium transition-all hover:-translate-y-2">
              <div className="w-16 h-16 mb-4 rounded-full gradient-gold flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">ابتكار أنثوي</h3>
              <p className="text-muted-foreground leading-relaxed">
                نتابع أحدث التقنيات في الطباعة والمواد المستدامة لنقدم لكِ تصاميم جديدة ولمسات ساحرة.
              </p>
            </Card>
          </div>
        </section>

        {/* Mission Section */}
        <section>
          <Card className="p-12 shadow-premium bg-muted">
            <h2 className="text-3xl font-black text-center mb-6">
              رسالتنا <span className="text-gradient-primary">إليكِ</span>
            </h2>
            <p className="text-xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              أن نكون الوجهة الأولى للهدايا المخصصة الفاخرة في العالم العربي، مع تجربة سلسة،
              تصميم مبدع، وتغليف يبهرك منذ اللحظة الأولى حتى فتح العلبة.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
