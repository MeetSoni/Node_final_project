const { MongoClient,ObjectId } = require('mongodb');

let dbInstance = null;

async function initialize(url) {
  try {

    // const url="mongodb+srv://meetsoni784:admin@cluster0.lrkxg.mongodb.net/sample_mflix"
    const client = new MongoClient(url);

    await client.connect();
    dbInstance = client.db();
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:');
    throw error;
  }
}

function getDatabase() {
  if (!dbInstance) {
    throw new Error('Database not initialized! Please call initialize first.');
  }
  return dbInstance;
}

async function AllMovies() {
  const db = getDatabase();
  const movies = await db.collection('movies').find({}).toArray();
  console.log(movies);
  return movies;
}

async function getMovieById(id) {
  const db = getDatabase();
  // console.log(id);
  const objectId = new ObjectId(id);
  
  const movie = await db.collection('movies').findOne({ _id: objectId });
  // console.log(movie);
  return movie;
}



async function addNewMovie(data) {
    try{const db = getDatabase();

    const collection = db.collection('movies');
   
  const result = await db.collection('movies').insertOne(data);
  console.log(result);


    console.log(`Added a new movie with ID: ${result.insertedId}`);}
    catch (err) {
      console.error('Error occurred:', err);
      res.status(500).json({ success: false, message: 'An error occurred while adding the movie' });
    } finally {
      // Close the client connection
      await client.close();
    }
}



async function getAllMovies(page, perPage, title) {
  const db = getDatabase();

    // Access the database and collection
    // const collection = db.collection('movies'); // Replace 'movies' with your collection name

    // Construct the query based on the title filter (if provided)
    const query = title ? { title: { $regex: title, $options: 'i' } } : {};
    console.log(query);

    // Get the total count of documents to determine pagination
    const totalCount = await db.collection('movies').countDocuments(query);

    // Calculate skip and limit based on page and perPage
    const skip = (page - 1) * perPage;
    const limit = perPage;

    // Fetch movies for the specified page, sorted by Movie_id
    const movies = await db.collection('movies')
      .find(query)
      .sort({ Movie_id: 1 }) // Sort by Movie_id in ascending order
      .skip(skip)
      .limit(limit)
      .toArray();

      console.log(totalCount);
     

    return {
      
      movies,
    };
  
}

// Example usage:
const pageNumber = 2;
const itemsPerPage = 5;
const filterByTitle = 'specific title'; // Set to null or undefined to ignore title filter

getAllMovies(pageNumber, itemsPerPage, filterByTitle)
  .then(result => {
    if (result) {
      console.log('Total movies:', result.totalCount);
      console.log('Movies for page', pageNumber, ':', result.movies);
    } else {
      console.log('Failed to fetch movies.');
    }
  })
  .catch(err => {
    console.error('Error:', err);
  });

  

  // Update a movie by its _id
  async function updateMovieById(data, id) {
    const db = getDatabase();
  
    try {
      // Convert the id string to ObjectId
      const objectId = new ObjectId(id);
  
      // Update the movie where _id matches the provided id
      const result = await db.collection('movies').updateOne(
        { _id: objectId },
        { $set: data }
      );
  
      if (result.modifiedCount > 0) {
        console.log(`Updated movie with _id ${id}`);
        return { success: true, message: `Movie with _id ${id} updated successfully` };
      } else {
        console.log(`No movie found with _id ${id}`);
        return { success: false, message: `No movie found with _id ${id}` };
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  }

async function deleteMovieById(id) {
  const db = getDatabase();
  const objectId = new ObjectId(id);

  const result = await db.collection('movies').deleteOne({ _id: objectId });
  if (result.deletedCount === 1) {
    return { success: true, message: 'Movie deleted successfully' };
  } else {
    return { success: false, message: 'No movie found with the provided ID' };
  }
}

// Add other CRUD operations as needed (create, update, delete)

module.exports = {
  AllMovies,
  initialize,
  getAllMovies,
  getMovieById,
  addNewMovie,
  updateMovieById,
  deleteMovieById
  // Add other functions here
};
