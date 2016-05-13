/**
 * InvoiceController
 *
 * @description :: Server-side logic for managing invoices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    ChangeStatus: function (req, res) {
        var role = req.param('role');
        var invoice = req.param('invoice');
        var rejectReason = req.param('rejectReason');
        if (role == "Approver") {
            var newStatus="Approver Rejected";
        }
        else {
            var newStatus="Broad Rejected";
        }
        Invoice.update({ InvoiceNo: invoice }, { Status: newStatus , Comment: rejectReason }).exec(function (err, data) {
            if (err) {
                sails.log.error('error updating', err);
                res.send(500, { title: 'error Updating Status' });
            } else {
                res.send(200, {});
                sails.log.debug('Updating success');
            }
        });
    }
	
};

