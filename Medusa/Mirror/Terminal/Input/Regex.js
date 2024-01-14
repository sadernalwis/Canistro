
class Regex{

    constructor(this, rgx=''){
        rt = type(rgx)
        if rt in (str,):     this.rgx = rgx
        elif rt in (Regex,): this.rgx = rgx.rgx
        this._text = ''
        this._match = None
        this._requisites = {}
    }

    copy(this, name=None):
        rgx = Regex(this.rgx)
        rgx._text = this._text
        rgx._match = this._match
        rgx._requisites = this._requisites
        if name : rgx.named(name) b
        return rgx
        
    clean(text){
        text = text || this._text
        text = text.replace(new Regexp('\s+'), ' ').trim()
        text = text.replace(new Regexp('\s*:\s*'), ':').trim()
        text = text.replace(new Regexp('\s*/\s*'), '/').trim()
        text = text.replace(new Regexp('\s*>\s*'), '>').trim()
        text = text.replace(new Regexp('\s*<\s*'), '<').trim()
        text = text.replace(new Regexp('\s*,\s*'), ',').trim()
        // text = text.replace(new Regexp('\s*|\s*'), '|').trim()
        text = text.replace(new Regexp('^,+'), '').trim()
        this._text = text
        return this
    }
    
    split(this, splitter, scrub=True, text=None):
        if text: this._text = text
        line = this.scrub().clean()._text if scrub else this.clean()._text
        return [Regex().clean(split)._text for split in line.split(splitter)]
        
    one_of(this, *choices):
        this.rgx += '|'.join(choices)
        return this

    X(this, amount):
        this.rgx = '|'.join([this.rgx]*amount)
        return this

    choices(this, *args):
        this.rgx += '|'.join(args)
        return this

    add_choices(this, *args):
        if args: this.rgx += '|' 
        this.rgx += '|'.join(args)
        return this
    
    named(this, name, multi=''):
        this.rgx = '(?P<%s>%s)%s'%(name, this.rgx, multi)
        return this

    
    OR(this):
        this.rgx += '|'
        return this
    
    lazy(this):
        this.rgx += '?'
        return this
    
    preceding(this, pre_rgx, name=None): # https://stackoverflow.com/questions/2973436/regex-lookahead-lookbehind-and-atomic-groups
        if type(pre_rgx) is Regex : pre_rgx = pre_rgx.rgx
        prgx = '(?=%s)'%pre_rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, prgx) 
        else:    this.rgx += '(?:%s)'% prgx
        return this

    not_preceding(this, pre_rgx, name=None):
        if type(pre_rgx) is Regex : pre_rgx = pre_rgx.rgx
        prgx = '(?!%s)'%pre_rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, prgx) 
        else:    this.rgx += '(?:%s)'% prgx
        return this

    following(this, pre_rgx, name=None):
        if type(pre_rgx) is Regex : pre_rgx = pre_rgx.rgx
        prgx = '(?<=%s)'%pre_rgx
        if name: this.rgx = ('(?P<%s>%s)'%(name, prgx) ) + this.rgx
        else:    this.rgx = ('(?:%s)'% prgx) + this.rgx
        return this

    not_following(this, pre_rgx, name=None):
        if type(pre_rgx) is Regex : pre_rgx = pre_rgx.rgx
        prgx = '(?<=%s)'%pre_rgx
        if name: this.rgx = ('(?P<%s>%s)'%(name, prgx) ) + this.rgx
        else:    this.rgx = ('(?:%s)'% prgx) + this.rgx
        return this

    polarity(this, name=None, units=''):
        if type(units) is Regex : units = units.rgx
        if name: this.rgx += '(?P<%s>(?:[-+])*\s?%s)'%(name, units) 
        else:    this.rgx += '(?:(?:[-+])*\s?%s)'% units
        return this
    
    rational(this, name=None, units=''):
        if type(units) is Regex : units = units.rgx
        # if name: this.rgx += '(?P<%s>(?:-)*\d+(?:\.\d*)?\s?%s)'%(name, units) 
        # else:    this.rgx += '(?:(?:-)*\d+(?:\.\d*)?\s?%s)'% units
        if name: this.rgx += '(?P<%s>(?:-)*\d+(?:\.\d*)?%s)'%(name, units) 
        else:    this.rgx += '(?:(?:-)*\d+(?:\.\d*)?%s)'% units
        return this

    digit(this, name=None, units='x'):
        if type(units) is Regex : units = units.rgx
        # if name: this.rgx += '(?P<%s>[-+]?\d+\s?%s)'%(name, units) 
        # else:    this.rgx += '(?:[-+]?\d+\s?%s)'% units
        if name: this.rgx += '(?P<%s>[-+]?\d+%s)'%(name, units) 
        else:    this.rgx += '(?:[-+]?\d+%s)'% units
        return this
    
    index(this, name=None):
        if name: this.rgx += '(?P<%s>\d+)'%name
        else:    this.rgx += '(?:\d+)'
        return this

    identifier(this, name=None, additionals=''):
        if name: this.rgx += '(?P<%s>[\w\s%s]+)'%(name, additionals)
        else:    this.rgx += '(?:[\w\s%s]+)'%additionals
        return this

    file_name(this, name=None):
        if name: this.rgx += '(?P<%s>[\w\s.]+)'%name
        else:    this.rgx += '(?:[\w\s.]+)'
        return this

    file_path(this, name=None):
        if name: this.rgx += '(?P<%s>(?:/[^/]+)+?/\w+\.\w+)'%name
        else:    this.rgx += '(?:(?:/[^/]+)+?/\w+\.\w+)'
        return this

    path(this, name=None):
        if name: this.rgx += '(?P<%s>(\/([a-zA-Z0-9_-])*)+)'%name
        else:    this.rgx += '(?:(\/([a-zA-Z0-9_-])*)+)'
        return this

    comma_seperated(this, name=None):
        if name: this.rgx += '(?P<%s>[\w\s.,]+)'%name
        else:    this.rgx += '(?:[\w\s.,]+)'
        return this
        
    
    or_not(this):
        this.rgx += '*'
        return this

    
    many(this):
        this.rgx += '+'
        return this
    
    
    many_or_none(this):
        this.rgx += '*'
        return this

    
    xox(this):
        this.rgx += '*'
        return this

    
    one_or_many(this):
        this.rgx += '+'
        return this

    
    xx(this):
        this.rgx += '+'
        return this

    x1oM(this):
        this.rgx += '+'
        return this

    x1om(this):
        this.rgx += '+'
        return this

    
    one_or_none(this):
        this.rgx += '?'
        return this

    
    x1o0(this):
        this.rgx += '?'
        return this

    
    space(this):
        this.rgx += '\s'
        return this

    stop(this):
        this.rgx += '\s'
        return this
    
    _(this):
        return this.space()

    _maybe(this):
        return this.spaces_or_not()

    
    _0(this):
        return this.spaces_or_not()

    
    _x(this):
        return this.spaces()
        
    
    _x(this):
        return this.spaces()

    
    spaces(this):
        return this.space.many()

    
    spaces_or_not(this):
        return this.space.or_not()

    __add__(this, other):
        ot = type(other)
        if ot in (str,):     this.rgx += other
        elif ot in (Regex,): this.rgx += other.rgx
        return this

    __call__(this, *args):
        if args:
            args = [arg.rgx if type(arg) is Regex else str(arg) for arg in args]
            this.rgx += '(?:%s)'%('|'.join(args),)
        else:
            this.rgx = ''
        return this
    
    __radd__(this, other): # Foo("b") + "a" (calls __add__()) or "a" + Foo("b") (calls __radd__()).
        ot = type(other)
        if ot in (str,):     this.rgx = other + this.rgx
        return this

    __getattr__(this, name: str):
        # super().__getattribute__(name)
        try:
            attr = object.__getattribute__(this, name)
            return attr
        except Exception as e:
            rgx = object.__getattribute__(this, 'rgx')
            setattr(this, 'rgx', rgx+(name.replace('_',' ').lower())) #super().__setattr__(this, 'rgx', rgx+name.replace('_',' ').lower())
            return this
        

    metric_degree(this):
        this.rgx += 'degrees|degree|deg|d'
        return this

    metric_relative(this):
        this.rgx += 'sin|%|log'
        return this
    
    metric_length(this):
        this.rgx += 'km|m|cm|mm|um'
        return this

    metric_duration(this):
        this.rgx += 'y|l|w|d|h|m|s|f'
        return this

    length_units(this, name=None, metric_only=False):
        metric = ('km','m','cm','mm','um')
        non_metric = ('sin','%','log')
        units = '|'.join(metric if metric_only else metric+non_metric)
        if name: this.rgx += '(?P<%s>%s)'%(name, units)
        else:    this.rgx += '(?:%s)'%(units)
        return this

    degree_units(this, name=None, metric_only=False):
        metric = ('degrees','degree','deg')
        non_metric = ('sin','%','log')
        units = '|'.join(metric if metric_only else metric+non_metric)
        if name: this.rgx += '(?P<%s>%s)'%(name, units)
        else:    this.rgx += '(?:%s)'%(units)
        return this

    degree_range(this, name=None, relative=False):
        if relative:
            r1 = (Regex().rational().OR()('same', 'opposite', 'reverse').named('%s_deg_start'%name)._().x1o0() + Regex().degree_units('%s_unit_start'%name).x1o0()).named('%s_start'%name)
            r2 = (Regex().rational().OR()('same', 'opposite', 'reverse').named('%s_deg_end'%name)._().x1o0() + Regex().degree_units('%s_unit_end'%name).x1o0()).named('%s_end'%name)
        else:
            r1 = (Regex().rational('%s_deg_start'%name)._().x1o0() + Regex().degree_units('%s_unit_start'%name).x1o0()).named('%s_start'%name)
            r2 = (Regex().rational('%s_deg_end'%name)._().x1o0() + Regex().degree_units('%s_unit_end'%name).x1o0()).named('%s_end'%name)
        r3 = (r1._().x1o0() + Regex(':')._().x1o0() + r2).rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, r3)
        else:    this.rgx += '(?:%s)'%(r3)
        return this

    length_range(this, name=None, relative=False):
        if relative:
            r1 = (Regex().rational().OR()('same', 'opposite', 'reverse').named('%s_len_start'%name)._().x1o0() + Regex().length_units('%s_unit_start'%name).x1o0()).named('%s_start'%name)
            r2 = (Regex().rational().OR()('same', 'opposite', 'reverse').named('%s_len_end'%name)._().x1o0() + Regex().length_units('%s_unit_end'%name).x1o0()).named('%s_end'%name)
        else:
            r1 = (Regex().rational('%s_len_start'%name)._().x1o0() + Regex().length_units('%s_unit_start'%name).x1o0()).named('%s_start'%name)
            r2 = (Regex().rational('%s_len_end'%name)._().x1o0() + Regex().length_units('%s_unit_end'%name).x1o0()).named('%s_end'%name)
        r3 = (r1._().x1o0() + Regex(':')._().x1o0() + r2).rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, r3)
        else:    this.rgx += '(?:%s)'%(r3)
        return this

    label(this, name=None):
        r3 = (Regex().identifier('%s_id'%name)._().x1o0() + Regex(':')._().x1o0()).rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, r3)
        else:    this.rgx += '(?:%s)'%(r3)
        return this
    
    resolution(this, name=None):
        r3 = ((Regex().digit('%s_x'%name, units='')._().x1o0() + Regex('x')._().x1o0())+(Regex().digit('%s_y'%name, units='')._().x1o0())).rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, r3)
        else:    this.rgx += '(?:%s)'%(r3)
        return this
    
    digit_prefix(this, prefix, name=None):
        r3 = (Regex(prefix)._().x1o0() + Regex().digit('%s_digit'%name, units='')._().x1o0()).rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, r3)
        else:    this.rgx += '(?:%s)'%(r3)
        return this
    
    digit_postfix(this, postfix, name=None):
        r3 = (Regex().digit('%s_digit'%name, units='')+Regex(postfix)._().x1o0()).rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, r3)
        else:    this.rgx += '(?:%s)'%(r3)
        return this
        
    percentage(this, name=None):
        r3 = (Regex().rational('%s_percentage'%name)._().x1o0() + Regex('%')).rgx
        if name: this.rgx += '(?P<%s>%s)'%(name, r3)
        else:    this.rgx += '(?:%s)'%(r3)
        return this
        
    #-----------------------------------------------------------------------------------
    absolute_degree(this, value_id, unit_id):
        this.rational().named(value_id)._().x1o0()
        this + Regex().metric_degree().named(unit_id).x1o0()
        return this

    relative_degree(this, value_id, unit_id):
        this.rational().OR()('same', 'opposite', 'reverse').stop().named(value_id).x1o0()
        this + Regex().metric_degree().OR().metric_relative().named(unit_id).x1o0()
        return this

    #-----------------------------------------------------------------------------------
    absolute_length(this, value_id, unit_id):
        this.rational().named(value_id)._().x1o0()
        this + Regex().metric_length().named(unit_id).x1o0()
        return this

    relative_length(this, value_id, unit_id):
        this.rational().OR()('same', 'opposite', 'reverse').stop().named(value_id).x1o0()
        this + Regex().metric_length().OR().metric_relative().named(unit_id).x1o0()
        return this

    #-----------------------------------------------------------------------------------
    absolute_duration(this, value_id, unit_id):
        this.rational().named(value_id)._().x1o0()
        this + Regex().metric_duration().named(unit_id).x1o0()
        return this

    relative_duration(this, value_id, unit_id):
        this.rational().OR()('same', 'opposite', 'reverse').stop().named(value_id).x1o0()
        this + Regex().metric_duration().OR().metric_relative().named(unit_id).x1o0()
        return this

    #-----------------------------------------------------------------------------------
    # @property
    rest(this):
        this.rgx += '(?P<rest>\s[-\w\s.,%]*)*'
        return this

    end(this):
        this.rgx += '$'
        return this

    start(this):
        this.rgx = '^'+this.rgx
        return this

    match(this, text=''):
        if text: this._text = text
        this._match = re.search(this.rgx, this._text)
        return this, this._match

    match_front(this, text=''):
        if text: this._text = text
        this._match = re.search('^'+this.rgx, this._text)
        return this, this._match

    match_front_recurse(this, text=''):
        y = True
        matches = []
        while y:
            rx, y = this.match_front(text)
            if y:
                matches.append(rx._match.groupdict())
                text = rx.scrub().clean()._text
        return matches, text

    match_back(this, text=''):
        if text: this._text = text
        this._match = re.search(this.rgx+'$', this._text)
        return this, this._match

    remove_substrings(this, text, indexes): #https://stackoverflow.com/questions/64235912/removing-multiple-substrings-from-a-text-with-index
        ''' indexes is a list containing start and end indexes. indexes = ["3 5", "7 8"] '''
        int_indexes = []
        for idx in indexes:
            s1,s2 = idx.split()
            int_indexes.append([int(s1), int(s2)])
        int_indexes.sort()
        int_indexes.reverse()
        for idx in int_indexes: text = text[0:idx[0]] + text[idx[1]:]
        return text

    replace_groups(this, groups, replacement, text): #https://stackoverflow.com/questions/33634232/replace-named-group-in-regex-match
        replace_closure(subgroup, replacement, m):
            if m.group(subgroup) not in [None, '']:
                start = m.start(subgroup)
                end = m.end(subgroup)
                return m.string[:start] + replacement + m.string[end:]
                # return m.group()[:start] + replacement + m.group()[end:]
        val = text #subgroup_list = ['pos', 'fID', 'zID', 'cID'] #replacement = '---'
        for subgroup in groups:
            val = text.replace(new Regexhis.rgx, partial(replace_closure, subgroup, replacement), val)
        return val

    replace_spans(this, groups, replacement, text):
        m = this._match
        spans = []
        if m and hasattr(m, 'groupdict'): 
            if groups:
                gd, req = m.groupdict(), this._requisites
                spans = [m.span(group) for group in groups if group in gd and m.group(group)]
            else: spans = [m.span(0)]
        spans.sort()
        spans.reverse()
        for idx in spans: text = text[0:idx[0]] + replacement + text[idx[1]:]
        return text

    chop(this, before=None, after=None):
        m = this._match
        spans = []
        text = this._text
        if m and hasattr(m, 'groupdict'): 
            gd = m.groupdict()
            if before and not after: 
                if before in gd:
                    start_span = m.span(before)
                    sspan = start_span[0]
                    spans = [ [0,sspan-1 if sspan>0 else sspan]]
            elif after and not before: 
                if after in gd:
                    after_span = m.span(after)
                    spans = [ [after_span[1], len(m.string)]]
            elif before and after:
                if before in gd and after in gd:
                    start_span = m.span(before)
                    after_span = m.span(after)
                    spans = [ [0,start_span[0]],[after_span[1], len(m.string)]]
        spans.sort()
        spans.reverse()
        for idx in spans: text = text[0:idx[0]] + text[idx[1]:]
        this._text = text
        return this

    scrub(this, *groups):
        if this._text:
            this._text = this.replace_spans(groups, '', this._text)
        return this

    fill(this):
        m = this._match
        if m and hasattr(m, 'groupdict'): 
            gd, req = m.groupdict(), this._requisites
            none_keys = [key for key in req if req.get(key) in (None, '')] if req else  list(gd.keys())
            this._requisites = this._requisites | Utilities.serial_fill(gd, *none_keys)
        return this
        
    requires(this, *attributes, fill=False):
        this._requisites =  Utilities.serial_fill({}, *attributes)
        if fill: this.fill()
        return this

    @property
    data(this):
        return this._requisites 

    has(this, *args):
        data = this.data
        if not args: args = list(this.data.keys())
        for arg in args:
            if data.get(arg) is None: return this, False
        return (this, True) if args and data else (this, False)
    

    grab(this, *groups):
        return Utilities.serial_get(this.data, *groups)


    sequence(this, *components, serial=True):
        r = '' if serial else '(?:'
        for i, w in enumerate(components):
            if serial: r+= '(%s)[\s,.!:\-()?]+'%w if i<len(components)-1  else '(%s)'%w
            else:      r+= '(%s)|'%w if i<len(components)-1 else '(%s))'%w
        this.rgx += r
        return this

    bone(this, name=False):
        pattern = '(?:left|right)?\s?(?:\w+)(?:\s[\d]+)?'
        if name: this.rgx += '(?P<%s>%s)' %(name,pattern)
        else: this.rgx += '(?:%s)'%pattern
        return this
    
    split_seperate(this, identifiers, splitter=',', group_name='group', tail_joiner=' ', overhead_combiner=' ', scrub=True, tails_combiner=None):
        overhead, tails = [],[]
        text = this._text
        tail = text.split(splitter)
        for tail_idx, tail_part in enumerate(tail):
            # match = re.search(r"(?P<%s>%s)" % (group_name, '|'.join(identifiers), ), tail_part)
            rx, y = Regex().one_of(*identifiers).named(group_name).requires(group_name).clean(tail_part).match_front()[0].fill().has()
            if y: 
                if scrub: tail_part = rx.scrub()._text
                extraction = rx.grab(group_name)[0]
                tails.append([tail_part, extraction])
                # tails.append([tail_part, match.group(group_name)])
            else: 
                if tails: tails[-1][0] += (tail_joiner + tail_part)
                else: overhead.append(tail_part)
        if overhead_combiner is not None: overhead = overhead_combiner.join(overhead)
        # if tails_combiner is not None: tails = tails_combiner.join(tails)
        return overhead, tails

    seperated_multi_range(this, name, components, seperator, min, max): #re.split('[\s,]', '')
        units = '|'.join((seperator + item for item in components))
        if name: this.rgx += '(?P<%s>(?:%s){%d,%d})'%(name, units, min, max)
        else:    this.rgx += '(?:(?:%s){%d,%d})'%(units, min, max)
        return this
    
    seperate(this, seperator):
        return re.split(seperator, this._text)

    supersymmetry(this, name):
        return this.seperated_multi_range(name, ('up','down','left','right','front','back'), '[\s,]+', 1 , 6)
    }
_ = Regex