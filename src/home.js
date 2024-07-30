import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, CircularProgress } from "@material-ui/core";
import cblogo from "./logo.jpg";
import image from "./bg1.png";
import { DropzoneArea } from 'material-ui-dropzone';
import axios from "axios";

export { ImageUpload };

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  uploadButton: {
    width: "100%",
    borderRadius: "1rem", // 16px in rem
    padding: "1rem 1.25rem", // 16px 22px in rem
    color: "white",
    fontSize: "1.25rem", // 20px in rem
    fontWeight: 900,
    backgroundColor: "#4caf50", // Green color
    '&:hover': {
      backgroundColor: "#388e3c", // Darker green on hover
    },
  },
  root: {
    maxWidth: "25rem", // 400px in rem
    flexGrow: 1,
  },
  media: {
    height: "25rem", // 400px in rem
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: "32rem", // 512px in rem
  },
  gridContainer: {
    justifyContent: "center",
    padding: "2rem 1rem 0 1rem",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
    marginTop: "0.5rem", // 8px in rem
  },
  imageCard: {
    margin: "auto",
    maxWidth: "25rem", // 400px in rem
    height: "37.5rem", // 600px in rem
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    boxShadow: '0px 0.5rem 4.5rem 0px rgb(0 0 0 / 30%) !important', // 8px 70px in rem
    borderRadius: '1rem', // 16px in rem
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  imageCardEmpty: {
    height: 'auto',
  },
  noImage: {
    margin: "auto",
    width: "25rem", // 400px in rem
    height: "25rem !important", // 400px in rem
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
  table: {
    backgroundColor: 'transparent !important',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'transparent !important',
  },
  tableCell: {
    fontSize: '1.2rem', // 18px in rem
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '0.5rem 1rem',
    whiteSpace: 'nowrap', // Prevents wrapping
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tableCell1: {
    fontSize: '1rem', // 14px in rem
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#000000a6 !important',
    fontWeight: 'bolder',
    padding: '0.5rem 1rem',
    whiteSpace: 'nowrap', // Prevents wrapping
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tableBody: {
    backgroundColor: 'transparent !important',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "26rem", // 416px in rem
    width: "100%",
  },
  detail: {
    backgroundColor: 'white',
  },
  appbar: {
    background: 'linear-gradient(90deg, #8B7AF5, #FFB74D)', // lavender to light pinkish orange gradient
    boxShadow: 'none',
    color: 'white',
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '6.25rem', // 100px in rem
  },
}));


const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false); // Added state for loading
  let confidence = 0;

  const cropAndResizeImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        canvas.width = 256;
        canvas.height = 256;
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 256, 256);

        canvas.toBlob(callback, 'image/jpeg');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const sendFile = async (file) => {
    if (image) {
      setLoading(true); // Start loading
      cropAndResizeImage(file, async (croppedFile) => {
        let formData = new FormData();
        formData.append("file", croppedFile);
        let res = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL,
          data: formData,
        });
        if (res.status === 200) {
          setData(res.data);
        }
        setLoading(false); // Stop loading
      });
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!selectedFile) {
      return;
    }
    sendFile(selectedFile);
  }, [selectedFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence)).toFixed(2);
  }

  const handleCheckNew = () => {
    setSelectedFile(undefined);
    setPreview(undefined);
    setData(undefined);
    setImage(false);
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Plant Infection Detection
          </Typography>
          <div className={classes.grow} />
          <Avatar src={cblogo}></Avatar>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              <CardContent>
                {!image && (
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText="Drag and drop an image here or click"
                    onChange={onSelectFile}
                  />
                )}
                {image && (
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={preview}
                      component="img"
                      title="Image of a potato plant leaf"
                    />
                  </CardActionArea>
                )}
                {loading && <div className={classes.spinner}><CircularProgress /></div>}
                {data && (
                  <React.Fragment>
                    <TableContainer className={classes.tableContainer} component={Paper}>
                      <Table className={classes.table}>
                        <TableHead className={classes.tableHead}>
                          <TableRow className={classes.tableRow}>
                            <TableCell className={classes.tableCell}>Prediction</TableCell>
                            <TableCell className={classes.tableCell}>Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableBody}>
                          <TableRow className={classes.tableRow}>
                            <TableCell className={classes.tableCell1}>{data.class}</TableCell>
                            <TableCell className={classes.tableCell1}>{confidence} %</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Grid item xs={12}>
                      <Button
                        className={classes.uploadButton}
                        variant="contained"
                        color="primary"
                        onClick={handleCheckNew}
                      >
                        Check New
                      </Button>
                    </Grid>
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
