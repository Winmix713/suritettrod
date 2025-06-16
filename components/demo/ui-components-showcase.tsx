"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"
import { Calendar, Search, Settings, User, FileText, Home, Package, Menu } from "lucide-react"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
]

export function UIComponentsShowcase() {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>()

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">UI Components Showcase</h1>
        <p className="text-muted-foreground">Demonstráció az újonnan implementált UI komponensekről</p>
      </div>

      <Tabs defaultValue="breadcrumb" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="breadcrumb">Breadcrumb</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="command">Command</TabsTrigger>
          <TabsTrigger value="sheet">Sheet</TabsTrigger>
          <TabsTrigger value="date">Date Picker</TabsTrigger>
        </TabsList>

        <TabsContent value="breadcrumb" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Breadcrumb Navigation</CardTitle>
              <CardDescription>Navigációs útvonal megjelenítése hierarchikus struktúrában</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Alapvető breadcrumb:</h4>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Figma Converter</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Ikonokkal:</h4>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/components" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Components
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documentation
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Table</CardTitle>
              <CardDescription>Strukturált adatok megjelenítése táblázatos formában</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">{invoice.invoice}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.paymentStatus === "Paid"
                              ? "default"
                              : invoice.paymentStatus === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {invoice.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="command" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Command Palette</CardTitle>
              <CardDescription>Gyors keresési és navigációs interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setOpen(true)}>
                <Search className="mr-2 h-4 w-4" />
                Open Command Palette
              </Button>

              <div className="border rounded-lg">
                <Command className="max-w-md">
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Calendar</span>
                      </CommandItem>
                      <CommandItem>
                        <Search className="mr-2 h-4 w-4" />
                        <span>Search Emoji</span>
                      </CommandItem>
                      <CommandItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                      <CommandItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                      </CommandItem>
                      <CommandItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>

              <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Quick Actions">
                    <CommandItem onSelect={() => setOpen(false)}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>New Document</span>
                    </CommandItem>
                    <CommandItem onSelect={() => setOpen(false)}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>New Project</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sheet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sheet (Side Panel)</CardTitle>
              <CardDescription>Oldalsó panel különböző irányokból</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open Left</Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Left Panel</SheetTitle>
                      <SheetDescription>This is a left-side sheet panel.</SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <p>Content goes here...</p>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open Right</Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Settings Panel</SheetTitle>
                      <SheetDescription>Configure your application settings here.</SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input placeholder="Enter your name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input placeholder="Enter your email" />
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Menu className="mr-2 h-4 w-4" />
                      Menu
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top">
                    <SheetHeader>
                      <SheetTitle>Navigation Menu</SheetTitle>
                      <SheetDescription>Quick access to main sections</SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <nav className="flex gap-4">
                        <Button variant="ghost">Home</Button>
                        <Button variant="ghost">Projects</Button>
                        <Button variant="ghost">Settings</Button>
                        <Button variant="ghost">Help</Button>
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="date" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Date Picker Components</CardTitle>
              <CardDescription>Dátum kiválasztó komponensek különböző módokban</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Single Date Picker:</h4>
                <DatePicker date={selectedDate} onDateChange={setSelectedDate} placeholder="Select a date" />
                {selectedDate && (
                  <p className="text-sm text-muted-foreground">Selected: {selectedDate.toLocaleDateString()}</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Date Range Picker:</h4>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  placeholder="Select date range"
                />
                {dateRange?.from && (
                  <p className="text-sm text-muted-foreground">
                    Range: {dateRange.from.toLocaleDateString()}
                    {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Disabled Date Picker:</h4>
                <DatePicker disabled={true} placeholder="Disabled picker" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
