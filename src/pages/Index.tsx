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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "operator" | "user";
type UserStatus = "active" | "inactive";

interface Person {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  assignedOperator?: string;
  clientsCount?: number;
  lastActive: string;
}

const Index = () => {
  const { toast } = useToast();
  const [people, setPeople] = useState<Person[]>([
    {
      id: 1,
      name: "Иван Петров",
      email: "ivan.petrov@company.ru",
      role: "admin",
      status: "active",
      clientsCount: 0,
      lastActive: "Сейчас онлайн",
    },
    {
      id: 2,
      name: "Мария Сидорова",
      email: "maria.sidorova@company.ru",
      role: "operator",
      status: "active",
      clientsCount: 24,
      lastActive: "1 час назад",
    },
    {
      id: 3,
      name: "Алексей Смирнов",
      email: "alexey.smirnov@company.ru",
      role: "operator",
      status: "active",
      clientsCount: 18,
      lastActive: "30 минут назад",
    },
    {
      id: 4,
      name: "Елена Кузнецова",
      email: "elena.kuznetsova@company.ru",
      role: "operator",
      status: "active",
      clientsCount: 31,
      lastActive: "2 часа назад",
    },
    {
      id: 5,
      name: "Дмитрий Волков",
      email: "dmitriy.volkov@company.ru",
      role: "operator",
      status: "inactive",
      clientsCount: 0,
      lastActive: "3 дня назад",
    },
    {
      id: 101,
      name: "Анна Соколова",
      email: "anna.sokolova@client.ru",
      role: "user",
      status: "active",
      assignedOperator: "Мария Сидорова",
      lastActive: "5 минут назад",
    },
    {
      id: 102,
      name: "Петр Морозов",
      email: "petr.morozov@client.ru",
      role: "user",
      status: "active",
      assignedOperator: "Мария Сидорова",
      lastActive: "1 час назад",
    },
    {
      id: 103,
      name: "Ольга Новикова",
      email: "olga.novikova@client.ru",
      role: "user",
      status: "active",
      assignedOperator: "Алексей Смирнов",
      lastActive: "15 минут назад",
    },
    {
      id: 104,
      name: "Сергей Павлов",
      email: "sergey.pavlov@client.ru",
      role: "user",
      status: "active",
      assignedOperator: "Елена Кузнецова",
      lastActive: "3 часа назад",
    },
    {
      id: 105,
      name: "Татьяна Белова",
      email: "tatyana.belova@client.ru",
      role: "user",
      status: "inactive",
      assignedOperator: "Мария Сидорова",
      lastActive: "2 дня назад",
    },
    {
      id: 106,
      name: "Михаил Орлов",
      email: "mikhail.orlov@client.ru",
      role: "user",
      status: "active",
      assignedOperator: "Алексей Смирнов",
      lastActive: "10 минут назад",
    },
    {
      id: 107,
      name: "Наталья Егорова",
      email: "natalya.egorova@client.ru",
      role: "user",
      status: "active",
      assignedOperator: "Елена Кузнецова",
      lastActive: "45 минут назад",
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as UserRole,
    status: "active" as UserStatus,
    assignedOperator: "",
  });

  const operators = people.filter(p => p.role === "operator");
  const users = people.filter(p => p.role === "user");

  const filteredData = people.filter((person) => {
    const tabMatch = 
      activeTab === "all" ? true :
      activeTab === "operators" ? person.role === "operator" :
      activeTab === "users" ? person.role === "user" :
      person.role === "admin";
    
    const statusMatch = filterStatus === "all" || person.status === filterStatus;
    const searchMatch = 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return tabMatch && statusMatch && searchMatch;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    operators: operators.filter(o => o.status === "active").length,
    totalOperators: operators.length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPerson) {
      setPeople(people.map(p => 
        p.id === editingPerson.id 
          ? { 
              ...p, 
              ...formData, 
              clientsCount: p.clientsCount,
              lastActive: p.lastActive 
            }
          : p
      ));
      toast({
        title: "Данные обновлены",
        description: "Изменения успешно сохранены",
      });
    } else {
      const maxId = Math.max(...people.map(p => p.id));
      const newPerson: Person = {
        id: maxId + 1,
        ...formData,
        clientsCount: formData.role === "operator" ? 0 : undefined,
        lastActive: "Только что",
      };
      setPeople([...people, newPerson]);
      toast({
        title: formData.role === "operator" ? "Оператор добавлен" : "Пользователь добавлен",
        description: "Запись успешно создана",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingPerson(null);
    setFormData({
      name: "",
      email: "",
      role: "user",
      status: "active",
      assignedOperator: "",
    });
  };

  const openEditDialog = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      email: person.email,
      role: person.role,
      status: person.status,
      assignedOperator: person.assignedOperator || "",
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = (role: UserRole = "user") => {
    resetForm();
    setFormData(prev => ({ ...prev, role }));
    setIsDialogOpen(true);
  };

  const deletePerson = (id: number) => {
    setPeople(people.filter(p => p.id !== id));
    toast({
      title: "Удалено",
      description: "Запись успешно удалена из системы",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Управление командой
          </h1>
          <p className="text-slate-600">
            Административная панель CRM-системы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Всего пользователей</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Users" className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Активные пользователи</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" className="text-emerald-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Операторы</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.operators}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="Headset" className="text-purple-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Администратор</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">1</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Icon name="Shield" className="text-amber-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white border-none shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="users">Пользователи ({stats.totalUsers})</TabsTrigger>
                <TabsTrigger value="operators">Операторы ({stats.totalOperators})</TabsTrigger>
                <TabsTrigger value="admin">Администратор</TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="md:w-64"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="inactive">Неактивные</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openAddDialog(activeTab === "operators" ? "operator" : "user")} className="gap-2">
                      <Icon name="UserPlus" size={18} />
                      Добавить
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingPerson ? "Редактировать" : "Добавить"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingPerson 
                          ? "Внесите изменения в данные" 
                          : "Заполните данные для создания записи"}
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
                          placeholder="ivan@example.ru"
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
                            <SelectItem value="user">Пользователь</SelectItem>
                            <SelectItem value="operator">Оператор</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.role === "user" && (
                        <div>
                          <Label htmlFor="operator">Назначить оператора</Label>
                          <Select
                            value={formData.assignedOperator}
                            onValueChange={(value) => setFormData({ ...formData, assignedOperator: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите оператора" />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map(op => (
                                <SelectItem key={op.id} value={op.name}>{op.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
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
                          {editingPerson ? "Сохранить" : "Создать"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold">Имя</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Роль</TableHead>
                      <TableHead className="font-semibold">Статус</TableHead>
                      {activeTab === "operators" && (
                        <TableHead className="font-semibold">Клиентов</TableHead>
                      )}
                      {activeTab === "users" && (
                        <TableHead className="font-semibold">Оператор</TableHead>
                      )}
                      <TableHead className="font-semibold">Активность</TableHead>
                      <TableHead className="font-semibold text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((person) => (
                      <TableRow key={person.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{person.name}</TableCell>
                        <TableCell className="text-slate-600">{person.email}</TableCell>
                        <TableCell>
                          {person.role === "admin" ? (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              <Icon name="Shield" size={14} className="mr-1" />
                              Администратор
                            </Badge>
                          ) : person.role === "operator" ? (
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                              <Icon name="Headset" size={14} className="mr-1" />
                              Оператор
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              <Icon name="User" size={14} className="mr-1" />
                              Пользователь
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {person.status === "active" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Активен
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-slate-200 text-slate-600 hover:bg-slate-200">
                              Неактивен
                            </Badge>
                          )}
                        </TableCell>
                        {activeTab === "operators" && (
                          <TableCell className="text-slate-600">
                            <div className="flex items-center gap-2">
                              <Icon name="Users" size={14} className="text-slate-400" />
                              {person.clientsCount || 0}
                            </div>
                          </TableCell>
                        )}
                        {activeTab === "users" && (
                          <TableCell className="text-slate-600">
                            {person.assignedOperator || "—"}
                          </TableCell>
                        )}
                        <TableCell className="text-slate-600">{person.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {person.role !== "admin" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(person)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Icon name="Pencil" size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deletePerson(person.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Index;
