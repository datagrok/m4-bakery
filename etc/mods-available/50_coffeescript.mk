targets := $(targets:.coffee=.js)

$(DST)/%.js: $(DST)/%.coffee
	coffee -c $^
