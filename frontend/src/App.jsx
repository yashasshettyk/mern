import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [bookStore, setBookStore] = useState([]);
  const [ItemEdit, setIsItemEdit] = useState(
    {
      isEnabled : false,
      Id:""
    }
  );
  const [bookdata, setBookData] = useState({ 
    title: "",
    author: "",
    publishYear: ""
  })
  const books = async () => {
    try {
      const response = await axios.get("http://localhost:5555/books");
      setBookStore(response.data.data);
    } catch {
      console.log("Error");
    }
  };
  books();

  const submitBook = async (event) => {
    event.preventDefault();
    if(ItemEdit.isEnabled){
      try{
        const response = await axios.put(`http://localhost:5555/book/update`,{...bookdata,bookId:ItemEdit.Id});
        
        setBookData(
          {
            title: "",
            author: "",
            publishYear: ""
          }
        )
        books();
        setIsItemEdit({isEnabled:false,Id:""});
        return;
      }
      catch{
        console.log('Error')
      }
    }
    else{
      try{
        const response = await axios.post('http://localhost:5555/books',bookdata);
        console.log(response);
        setBookData(
          {
            title: "",
            author: "",
            publishYear: ""
          }
        )
        books();
      }
  
      catch{
        console.log('Error')
      }
    }
    

    
  }

  const handlechange = (event)=>{
    const {name,value} = event.target;
    setBookData({
      ...bookdata,
      [name]:value

    })
    
  }

  const deleteBook = async (id)=>{
    try{
      const response = await axios.post('http://localhost:5555/book/delete',{bookId:id});
      console.log(response)
      books();
    }

    catch{
      console.log('Error')
    }
  }
  
    
 
    
  
  return (
    <div>
      <div className="book-list">
        {bookStore.map((book, index) => {
          return (
            <div key={index} className="book">
              <div className="div title">
                <h3>{book.title}</h3>
              </div>
              
              <p>{book.author}</p>
              <p>{book.publishYear}</p>
              <p className="delete" onClick={()=>{deleteBook(book._id)}}>X</p>
              <p className="edit" onClick={()=>{
                setIsItemEdit({isEnabled:true,Id:book._id});
                if(ItemEdit.isEnabled){
                  const book = bookStore.find(book=>book._id===ItemEdit.Id);
                  setBookData(book);
            
                }
                
              }}>edit</p>
            </div>
          );
        })}
      </div>

      <>
        <form onSubmit={submitBook} className="form-inputs">
          <input onChange={handlechange} value={bookdata.title} type="text" name="title" placeholder="Title" />
          <input onChange={handlechange} value={bookdata.author} type="text" name="author" placeholder="Author" />
          <input onChange={handlechange} value={bookdata.publishYear}  type="number" name="publishYear" placeholder="Publish Year" />
          <button type="submit">{ItemEdit.isEnabled? "Update Book":"Add Book"}</button>
        </form>

        
      </>
    </div>
  );
}

export default App;
