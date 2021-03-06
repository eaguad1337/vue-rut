function cleanRut(rut) {
	return rut.replace(/[^0-9kK]+/g,'').toLowerCase();
}

function formatRut(rut) {
	if (rut.length > 1) {
		rut = rut.slice(0,-1)+'-'+rut.slice(-1);
	if (rut.length > 5) {
		if (rut.length > 8) {
				return rut.slice(0,-8)+'.'+rut.slice(-8,-5) +'.'+rut.slice(-5);
			}
		return rut.slice(0,-5) +'.'+rut.slice(-5);
		}
	}
	return rut
}

function validateRut(rut) {
	var numberRut = cleanRut(rut).slice(0,-1);
	if (numberRut.length > 6) {
		var auxArray = [3,2,7,6,5,4,3,2]
		var sum =0

		for (var i = numberRut.length - 1; i >= 0; i--) {
			sum += parseInt(numberRut[i])*auxArray[i];
		}
		switch(11 - sum%11){
			case 11:
				return rut.slice(-1) == 0; 
			case 10:
				return rut.slice(-1) == 'k';
			default:
				return rut.slice(-1) == (11 - sum%11);
		}
	}
	return false;
}

export function rutFilter(value) {
 	return formatRut(cleanRut(value));
}


export const rutDirective = {

	bind: function(el, binding, vnode) {
		var _self = binding.def.data

		for (var i = vnode.data.directives.length - 1; i >= 0; i--) {
			if (vnode.data.directives[i].name == 'model') {
				_self.vueModel = vnode.data.directives[i].expression;
				break;
			}
		}
	},

	update: function(el, binding, vnode) {
		var _self = binding.def.data;

		if (_self.validateRut) {
			el.value = formatRut(cleanRut(el.value));
			_self.inputValue = el.value;
			
			if (validateRut(el.value)) {
				vnode.context[_self.vueModel] = cleanRut(el.value)
				_self.validateRut = false;
			}
			else {
				vnode.context[_self.vueModel] = null;
				_self.validateRut = false;				
			}
		}
		else {
			_self.validateRut = true;
			el.value = _self.inputValue;
		}
	},

	data: {
		vueModel: '',
		inputValue: '',
		validateRut: true
	}
}
