
    export const create = async (req, res) => {
      try {
        res.status(201).json({ 
          message: "smthng created successfully",
          data: req.body 
          });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };


    export const getOne = async (req, res) => {
        try {
          res.status(200).json({
            message: "Fetch ... with ID successful",
            data : "res here"
            })
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };
    


    export const getAll = async (req, res) => {
      try {
        res.status(200).json({
           message: "Fetch all datas successful" ,
           data : "res here"
          });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };


    export const update = async (req, res) => {
      try {
        res.status(200).json({ 
          message: "Update successful "
          });
      } catch (error) {
        res.status(500).json({ 
          error: error.message 
          });
      }
    };


    export const remove = async (req, res) => {
      try {
        res.status(200).json({ message: "Delete successful" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };