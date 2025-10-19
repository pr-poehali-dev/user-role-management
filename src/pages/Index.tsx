import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "operator";
type UserStatus = "active" | "inactive";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  projects: number;
  lastActive: string;
}

const Index = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Иван Петров",
      email: "ivan.petrov@company.ru",
      role: "admin",
      status: "active",
      projects: 5,
      lastActive: "2 часа назад",
    },
    {
      id: 2,
      name: "Мария Сидорова",
      email: "maria.sidorova@company.ru",
      role: "operator",
      status: "active",
      projects: 3,
      lastActive: "1 час назад",
    },
    {
      id: 3,
      name: "Алексей Смирнов",
      email: "alexey.smirnov@company.ru",
      role: "operator",
      status: "active",
      projects: 7,
      lastActive: "30 минут назад",
    },
    {
      id: 4,
      name: "Елена Кузнецова",
      email: "elena.kuznetsova@company.ru",
      role: "admin",
      status: "inactive",
      projects: 0,
      lastActive: "5 дней назад",
    },
  ]);

  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "operator" as UserRole,
    status: "active" as UserStatus,
  });

  const filteredUsers = users.filter((user) => {
    const roleMatch = filterRole === "all" || user.role === filterRole;
    const statusMatch = filterStatus === "all" || user.status === filterStatus;
    return roleMatch && statusMatch;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    operators: users.filter((u) => u.role === "operator").length,
    active: users.filter((u) => u.status === "active").length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData, projects: u.projects, lastActive: u.lastActive }
          : u
      ));
      toast({
        title: "Пользователь обновлен",
        description: "Изменения успешно сохранены",
      });
    } else {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        projects: 0,
        lastActive: "Только что",
      };
      setUsers([...users, newUser]);
      toast({
        title: "Пользователь добавлен",
        description: "Новый пользователь успешно создан",
      });
    }
    
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "operator",
      status: "active",
    });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "operator",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "Пользователь удален",
      description: "Пользователь успешно удален из системы",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Управление пользователями
          </h1>
          <p className="text-slate-600">
            Администрирование команды и распределение ролей
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Всего пользователей</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Users" className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Администраторы</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.admins}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="Shield" className="text-purple-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Операторы</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.operators}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="Headset" className="text-green-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Активные</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" className="text-emerald-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white border-none shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Фильтр по роли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все роли</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="operator">Оператор</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="inactive">Неактивные</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog} className="gap-2">
                  <Icon name="UserPlus" size={18} />
                  Добавить пользователя
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "Редактировать пользователя" : "Новый пользователь"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser 
                      ? "Внесите изменения в данные пользователя" 
                      : "Заполните данные для создания нового пользователя"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ivan@company.ru"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Роль</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Администратор</SelectItem>
                        <SelectItem value="operator">Оператор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активный</SelectItem>
                        <SelectItem value="inactive">Неактивный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button type="submit">
                      {editingUser ? "Сохранить" : "Создать"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Пользователь</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Роль</TableHead>
                  <TableHead className="font-semibold">Статус</TableHead>
                  <TableHead className="font-semibold">Проекты</TableHead>
                  <TableHead className="font-semibold">Последняя активность</TableHead>
                  <TableHead className="font-semibold text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          <Icon name="Shield" size={14} className="mr-1" />
                          Администратор
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          <Icon name="Headset" size={14} className="mr-1" />
                          Оператор
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.status === "active" ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Активный
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-200 text-slate-600 hover:bg-slate-200">
                          Неактивный
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">{user.projects}</TableCell>
                    <TableCell className="text-slate-600">{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="Pencil" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
