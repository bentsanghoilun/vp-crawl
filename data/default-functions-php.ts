export const defaultFunctionScript = `

function extract_slug($full_url) {	
	$parsed_url = parse_url($full_url);
    $path = trim($parsed_url['path'], '/');
    if (empty($path)) {
        return false;
    }
    if (strpos($path, '/') !== false) {
        return end(explode('/', $path));
    }
    return $path;
}

function extract_parent_slug($full_url) {
    $parsed_url = parse_url($full_url);
    $path = trim($parsed_url['path'], '/');
    $path_parts = explode('/', $path);
    
    if (count($path_parts) > 1) {
        return $path_parts[count($path_parts) - 2];
    }
    
    return false;
}

function slug_to_title($url) {
	$string = extract_slug($url);
	
	if($string == false){
		return 'Home';
	}
	
    return implode(' ', array_map('ucfirst', explode('-', $string)));
}


` 