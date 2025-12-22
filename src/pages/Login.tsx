import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password);  // WAIT for backend

    if (success) {
      toast.success('התחברת בהצלחה!');
      navigate('/');
    } else {
      toast.error('שם משתמש או סיסמה שגויים');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4">
      <Card className="w-full max-w-md p-8 shadow-premium">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">התחברות</h1>
          <p className="text-muted-foreground">היכנס לחשבון שלך</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">שם משתמש</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="הכנס שם משתמש"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">סיסמה</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הכנס סיסמה"
              required
            />
          </div>

          <Button type="submit" className="w-full gradient-primary text-white shadow-premium">
            התחבר
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
