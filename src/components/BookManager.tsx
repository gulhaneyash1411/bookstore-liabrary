import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash, ArrowLeft, ArrowRight, Search, BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function BookManager() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('')
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", description: "A novel set in the Roaring Twenties.", country: "USA", language: "English", year: 1925 },
    { id: 2, title: "1984", author: "George Orwell", description: "A dystopian novel about government surveillance and control.", country: "UK", language: "English", year: 1949 },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", description: "A novel about racial injustice in the American South.", country: "USA", language: "English", year: 1960 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", description: "A romantic novel set in 19th century England.", country: "UK", language: "English", year: 1813 },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", description: "A novel about a teenager's journey of self-discovery.", country: "USA", language: "English", year: 1951 },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", description: "A fantasy novel about a hobbit's adventure.", country: "UK", language: "English", year: 1937 },
    { id: 7, title: "Moby Dick", author: "Herman Melville", description: "A novel about a whaling voyage.", country: "USA", language: "English", year: 1851 },
    { id: 8, title: "War and Peace", author: "Leo Tolstoy", description: "A novel about the French invasion of Russia.", country: "Russia", language: "Russian", year: 1869 },
    { id: 9, title: "The Odyssey", author: "Homer", description: "An epic poem about a hero's journey.", country: "Greece", language: "Greek", year: -800 },
    { id: 10, title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", description: "A novel about a family's moral conflicts.", country: "Russia", language: "Russian", year: 1880 }
  ])
  const [personalList, setPersonalList] = useState<{ id: number, title: string, author: string, description: string, country: string, language: string, year: number }[]>([])
  const [editingBook, setEditingBook] = useState<{ id: number, title: string, author: string, description: string, country: string, language: string, year: number } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState('title')
  const [filterOption, setFilterOption] = useState('All')
  const [filterValue, setFilterValue] = useState('')

  const booksPerPage = 3

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
    setCurrentPage(1)
  }

  const handleFilterChange = (value: string) => {
    setFilterOption(value)
    setCurrentPage(1)
  }

  const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value)
    setCurrentPage(1)
  }

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterOption === 'All' || book[filterOption as keyof typeof book].toString().toLowerCase().includes(filterValue.toLowerCase()))
  )

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === 'title') {
      return a.title.localeCompare(b.title)
    } else if (sortOption === 'author') {
      return a.author.localeCompare(b.author)
    }
    return 0
  })

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook)

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const showNotification = (message: string) => {
    toast({
      title: message,
      duration: 2000,
    });
  };

  const handleAddToPersonalList = (book: { id: number, title: string, author: string, description: string, country: string, language: string, year: number }) => {
    if (personalList.some(b => b.id === book.id)) {
      showNotification("This book is already in your list");
      return;
    }
    setPersonalList([...personalList, book]);
    showNotification("Book added to your list");
  };

  const handleEditBook = (book: { id: number, title: string, author: string, description: string, country: string, language: string, year: number }) => {
    setEditingBook(book)
  }

  const handleSaveEdit = (id: number, title: string, author: string, description: string, country: string, language: string, year: number) => {
    setPersonalList(personalList.map(book => book.id === id ? { id, title, author, description, country, language, year } : book))
    setEditingBook(null)
  }

  const handleDeleteBook = (id: number) => {
    setPersonalList(personalList.filter(book => book.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <header className="backdrop-blur-lg bg-white/70 sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Book Manager</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 h-12 text-lg rounded-2xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              placeholder="Search books..."
            />
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-3xl font-semibold tracking-tight">Search Results</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="w-48">
                <Select onValueChange={handleFilterChange} defaultValue="All">
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filterOption !== 'All' && (
                <div className="w-48">
                  <Input
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    placeholder="Enter filter value..."
                    className="h-10"
                  />
                </div>
              )}

              <div className="w-48">
                <Select onValueChange={handleSortChange} defaultValue="title">
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {currentBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg border border-gray-100">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold leading-tight">{book.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-600">{book.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 bg-primary/5 rounded-md text-xs text-primary/80">{book.country}</span>
                        <span className="px-2 py-1 bg-primary/5 rounded-md text-xs text-primary/80">{book.language}</span>
                        <span className="px-2 py-1 bg-primary/5 rounded-md text-xs text-primary/80">{book.year}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => handleAddToPersonalList(book)}
                        className="w-full transition-all duration-200 hover:bg-primary hover:text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add to List
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="w-10 h-10 p-0 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="w-10 h-10 p-0 rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">My Books</h2>
          <AnimatePresence mode="popLayout">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {personalList.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg border border-gray-100">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold leading-tight">{book.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-gray-600">{book.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 bg-primary/5 rounded-md text-xs text-primary/80">{book.country}</span>
                        <span className="px-2 py-1 bg-primary/5 rounded-md text-xs text-primary/80">{book.language}</span>
                        <span className="px-2 py-1 bg-primary/5 rounded-md text-xs text-primary/80">{book.year}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => handleEditBook(book)}
                        className="flex-1 transition-all duration-200 hover:bg-primary hover:text-white"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeleteBook(book.id)}
                        className="flex-1"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {editingBook && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6"
              >
                <h2 className="text-2xl font-semibold mb-6">Edit Book</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      defaultValue={editingBook.title}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-author">Author</Label>
                    <Input
                      id="edit-author"
                      defaultValue={editingBook.author}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      defaultValue={editingBook.description}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-country">Country</Label>
                    <Input
                      id="edit-country"
                      defaultValue={editingBook.country}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-language">Language</Label>
                    <Input
                      id="edit-language"
                      defaultValue={editingBook.language}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-year">Year</Label>
                    <Input
                      id="edit-year"
                      type="number"
                      defaultValue={editingBook.year}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={() => setEditingBook(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      const title = (document.getElementById('edit-title') as HTMLInputElement).value;
                      const author = (document.getElementById('edit-author') as HTMLInputElement).value;
                      const description = (document.getElementById('edit-description') as HTMLTextAreaElement).value;
                      const country = (document.getElementById('edit-country') as HTMLInputElement).value;
                      const language = (document.getElementById('edit-language') as HTMLInputElement).value;
                      const year = parseInt((document.getElementById('edit-year') as HTMLInputElement).value, 10);
                      handleSaveEdit(editingBook.id, title, author, description, country, language, year);
                      showNotification("Book updated successfully");
                    }}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-gray-100 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          Book Manager &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
