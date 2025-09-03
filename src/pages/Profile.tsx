
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useEnrollments } from '@/hooks/useCourses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateProfile } = useProfile(user?.id);
  const { enrollments, loading: enrollmentsLoading } = useEnrollments(user?.id);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>You are not logged in.</p>
            <Button onClick={() => navigate('/auth')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }


  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ first_name: firstName, last_name: lastName, avatar_url: avatarUrl });
    setEditMode(false);
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || undefined} alt="User avatar" />
            <AvatarFallback>{profile?.first_name?.[0] || user.email[0]}</AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold">{user.email}</div>
          {editMode ? (
            <>
              <Input
                className="mt-2"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <Input
                className="mt-2"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
              <Input
                className="mt-2"
                placeholder="Avatar URL"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-muted-foreground">
                {profile?.first_name} {profile?.last_name}
              </div>
              <Button variant="outline" onClick={() => {
                setEditMode(true);
                setFirstName(profile?.first_name || '');
                setLastName(profile?.last_name || '');
                setAvatarUrl(profile?.avatar_url || '');
              }}>Edit Profile</Button>
            </>
          )}
          <Button variant="destructive" onClick={signOut}>Sign Out</Button>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollmentsLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8">No enrolled courses yet.</div>
          ) : (
            <div className="space-y-4">
              {enrollments.map(enrollment => (
                <div key={enrollment.course.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={enrollment.course.thumbnail_url || undefined} />
                    <AvatarFallback>{enrollment.course.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{enrollment.course.title}</div>
                    <div className="text-sm text-muted-foreground">{enrollment.course.instructor}</div>
                    <Progress value={enrollment.progress_percentage} className="h-2 mt-2" />
                  </div>
                  <div className="text-right min-w-[60px]">
                    <span className="text-sm font-medium">{enrollment.progress_percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
