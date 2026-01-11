const liveClassService = require('./liveClass.service');

exports.getLiveClasses = async (req, res, next) => {
  try {
    const liveClasses = await liveClassService.findAll();
    res.json({ success: true, count: liveClasses.length, data: liveClasses });
  } catch (error) {
    next(error);
  }
};

exports.getLiveClass = async (req, res, next) => {
  try {
    const liveClass = await liveClassService.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }
    res.json({ success: true, data: liveClass });
  } catch (error) {
    next(error);
  }
};

exports.createLiveClass = async (req, res, next) => {
  try {
    const liveClass = await liveClassService.create(req.body);
    res.status(201).json({ success: true, data: liveClass });
  } catch (error) {
    next(error);
  }
};

exports.updateLiveClass = async (req, res, next) => {
  try {
    const liveClass = await liveClassService.update(req.params.id, req.body);
    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }
    res.json({ success: true, data: liveClass });
  } catch (error) {
    next(error);
  }
};

exports.deleteLiveClass = async (req, res, next) => {
  try {
    const liveClass = await liveClassService.delete(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }
    res.json({ success: true, message: 'Live class deleted' });
  } catch (error) {
    next(error);
  }
};
