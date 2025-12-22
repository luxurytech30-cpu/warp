import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { sendContactMessage } from "@/lib/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await sendContactMessage(formData);

    toast.success("ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

  } catch (error) {
    toast.error("שליחת ההודעה נכשלה. נסה שוב.");
  }
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            צור <span className="text-gradient-primary">קשר</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            יש לך שאלה? רוצה לקבל ייעוץ מקצועי? אנחנו כאן בשבילך
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <Card className="p-8 shadow-card hover:shadow-premium transition-shadow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">טלפון</h3>
            <p className="text-muted-foreground mb-3">ניתן להתקשר אלינו</p>
            <a href="tel:03-1234567" className="text-primary font-semibold text-lg hover:underline">
              03-1234567
            </a>
          </Card>

          <Card className="p-8 shadow-card hover:shadow-premium transition-shadow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">דוא״ל</h3>
            <p className="text-muted-foreground mb-3">שלח לנו הודעה</p>
            <a href="mailto:info@building-premium.co.il" className="text-primary font-semibold hover:underline">
              info@building-premium.co.il
            </a>
          </Card>

          <Card className="p-8 shadow-card hover:shadow-premium transition-shadow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">כתובת</h3>
            <p className="text-muted-foreground mb-3">בואו לבקר אותנו</p>
            <p className="font-semibold">רחוב הבניין 123, תל אביב</p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 shadow-premium">
            <h2 className="text-3xl font-black mb-6">שלח לנו הודעה</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">שם מלא *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="הכנס את שמך המלא"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">דוא״ל *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="050-1234567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">נושא *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="במה נוכל לעזור?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">הודעה *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="פרט את הפנייה שלך..."
                  rows={6}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary text-white shadow-premium"
              >
                <Send className="ml-2 h-5 w-5" />
                שלח הודעה
              </Button>
            </form>
          </Card>

          {/* Additional Info */}
          <div className="space-y-8">
            <Card className="p-8 shadow-card">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">שעות פעילות</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>ראשון - חמישי:</strong> 07:00 - 18:00</p>
                    <p><strong>שישי:</strong> 07:00 - 14:00</p>
                    <p><strong>שבת:</strong> סגור</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 gradient-hero text-white shadow-premium">
              <h3 className="text-2xl font-bold mb-4">צריך ייעוץ מקצועי?</h3>
              <p className="mb-6 leading-relaxed">
                הצוות המקצועי שלנו זמין לתת לך ייעוץ חינם בבחירת חומרי הבניין המתאימים לפרויקט שלך.
                התקשר עכשיו וקבל המלצות מקצועיות.
              </p>
              <Button
                size="lg"
                className="w-full bg-white text-foreground hover:bg-white/90"
              >
                <Phone className="ml-2 h-5 w-5" />
                חייג עכשיו: 03-1234567
              </Button>
            </Card>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
