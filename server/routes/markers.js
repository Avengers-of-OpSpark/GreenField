const router = require('express').Router();

const { Markers } = require('../db/database');
const cloudinary = require('cloudinary');
const { getIdByUsername } = require('../helpers/user');

router.route('/').get((req, res) => {
  Markers.findAll({})
    .then((data) => res.send(data))
    .catch((err) => console.error('Can\'t get markers', err));
});

router.route('/:id').get((req, res) => {
  const { id } = req.params;
  // eslint-disable-next-line camelcase
  Markers.findAll({ where: { id_user: id } })
    .then((data) => res.send(data))
    .catch((err) => console.error('Can\'t get markers', err));
});

router.route('/create').post((req, res) => {

  const values = Object.values(req.files);
  const promises = values.map(image => cloudinary.uploader.upload(image.path));
  const { latitude, longitude, description, id, rating, status} = req.body;

  Promise
    .all(promises)
    .then(res => {
      const newMarker = new Markers({
        latitude,
        imageUrl: res[0].url,
        longitude,
        description,
        rating: rating,
        status: status,
        // eslint-disable-next-line camelcase
        id_user: id
      });
      newMarker.save()
        .then((data) => console.log('MARKERS ADDED'))
        .catch((err) => console.error('Marker Not Added', err));
    })
    .catch(err => console.error('Error creating marker', err));
});

router.route('/:id').delete((req, res) => {
  const { id } = req.params;
  return Markers.destroy({ where: { id: id }})
    .then((data) => res.status(200).json(data))
    .catch((err) => console.log('deletion error', err));
});


module.exports = router;